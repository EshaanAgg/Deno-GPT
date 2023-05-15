import { get_progress } from "./utilities.ts";
import { randomChoice, toTitleCase } from "../helper.ts";
import { BOT_NAME, STICKERS, texts } from "../constants.ts";
import supabase from "../supabaseClient.ts";
import { customContext } from "../types.ts";

export const pollCreator = async (id: number, ctx: customContext) => {
  //   [i, deck, session, mid, pbar_mid, most_recent_poll_id]
  let [i, deck, session, __, pbar_mid, _] = ctx.session.chatDescription;
  let pbar_msg, return_msg;

  if (i >= 0) {
    pbar_msg = await ctx.api.sendMessage(
      id,
      toTitleCase(deck.replace("_", " ")) +
        ": " +
        get_progress(i, session.length)
    );
    if (i > 1) {
      try {
        await ctx.api.deleteMessage(id, pbar_mid);
      } catch (err) {
        console.log(err);
      }
    }
  }

  if (i == session.length) {
    const congrats_message = await ctx.api.sendSticker(
      id,
      randomChoice(STICKERS)
    );

    const complete_message = await ctx.api.sendMessage(id, texts["complete"]);

    try {
      const _ = await supabase.from("TempMsgs").insert({
        user: id,
        mid: complete_message?.message_id || 0,
        botName: BOT_NAME,
      });
      const __ = await supabase.from("TempMsgs").insert({
        user: id,
        mid: pbar_msg?.message_id || 0,
        botName: BOT_NAME,
      });
      const ___ = await supabase.from("TempMsgs").insert({
        user: id,
        mid: congrats_message?.message_id || 0,
        botName: BOT_NAME,
      });
    } catch (err) {
      console.log(err);
    }
    return;
  }

  const [question, qid, options, ans, ___, ____] = session[i];
  const ans_index = options.indexOf(ans);

  return_msg = await ctx.api.sendPoll(
    id,
    question,
    // Implicitly convert the options to string type
    options.map((opt: string | number) => opt.toString()),
    {
      is_anonymous: false,
      type: "quiz",
      correct_option_id: ans_index,
      explanation: "Insert explanation here.",
    }
  );

  // Store the information to map the polls to the questions
  ctx.session.pollInfo.push({
    pollId: return_msg.poll.id,
    questionId: qid,
    correctAnsIndex: ans_index,
  });

  // Check if the row corresponding to this question and user exists in the database
  // and doing the necessary updates if not
  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("question", qid.toString())
    .eq("user", id.toString());

  if (!data || data.length == 0) {
    await supabase.from("user_progress").insert({
      question: qid.toString(),
      user: id.toString(),
      correct: false,
    });
  }

  pbar_mid = pbar_msg?.message_id || 0;
  ctx.session.chatDescription = [
    i + 1,
    deck,
    session,
    return_msg?.message_id || 0,
    pbar_mid,
    parseInt(return_msg!.poll.id),
  ];

  try {
    await supabase.from("TempMsgs").insert({
      user: id,
      mid: return_msg?.message_id,
      botName: BOT_NAME,
    });
    await supabase.from("TempMsgs").insert({
      user: id,
      mid: pbar_mid,
      botName: BOT_NAME,
    });
  } catch (err) {
    console.log(err);
  }
  return [String(return_msg?.message_id), String(pbar_mid)];
};
