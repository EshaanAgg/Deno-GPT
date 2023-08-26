import { get_progress } from "./utilities.ts";
import { randomChoice, toTitleCase } from "../helper.ts";
import { STICKERS, texts } from "../constants.ts";
import supabase from "../supabaseClient.ts";
import { customContext } from "../types.ts";

export const pollCreator = async (id: number, ctx: customContext) => {
  //   [i, deck, session, mid, pbar_mid, most_recent_poll_id]
  let [i, deck, session, __, pbar_mid, _] = ctx.session.chatDescription;
  let pbar_msg;

  if (i >= 0) {
    pbar_msg = await ctx.api.sendMessage(
      id,
      toTitleCase(deck.replace("_", " ")) +
        ": " +
        get_progress(i, session.length),
    );
  }

  if (i == session.length) {
    await ctx.api.sendSticker(
      id,
      randomChoice(STICKERS),
    );

    let accuracy = (ctx.session.solvedCorrectly / session.length) * 100;
    if (isNaN(accuracy)) accuracy = 0;

    await ctx.api.sendMessage(
      id,
      `You had ${accuracy}% accuracy in this attempt!`,
    );

    await ctx.api.sendMessage(id, texts["complete"]);

    const { data } = await supabase.from("user_stats").select("*").eq(
      "user",
      id,
    ).eq("deck", deck);

    if (!data || data.length == 0) {
      await supabase.from("user_stats").insert({
        user: id,
        deck,
        accuracy,
      });
    } else {
      const currentDateTime = new Date();
      await supabase
        .from("user_stats")
        .update({ accuracy, updated_at: currentDateTime.toISOString() })
        .eq("user", id)
        .eq("deck", deck);
    }

    return;
  }

  const [question, qid, options, ans, ___, ____] = session[i];
  const ans_index = options.indexOf(ans);

  const return_msg = await ctx.api.sendPoll(
    id,
    question,
    // Implicitly convert the options to string type
    options.map((opt: string | number) => opt.toString()),
    {
      is_anonymous: false,
      type: "quiz",
      correct_option_id: ans_index,
      explanation: "Insert explanation here.",
    },
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
    return_msg!.poll.id,
  ];

  return [String(return_msg?.message_id), String(pbar_mid)];
};
