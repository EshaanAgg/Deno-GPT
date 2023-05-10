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
        " : " +
        (await get_progress(i.toString(), session.length))
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

  const [question, options, ans, ___, ____] = session[i];
  const ans_index = options.indexOf(ans);

  try {
    return_msg = await ctx.api.sendPoll(id, question, options, {
      is_anonymous: false,
      type: "quiz",
      correct_option_id: ans_index,
      explanation: "Insert explanation here.",
    });
  } catch (e) {
    console.log(e);
  }
  pbar_mid = pbar_msg?.message_id || 0;
  ctx.session.chatDescription = [
    i + 1,
    deck,
    session,
    return_msg?.message_id || 0,
    pbar_mid,
    parseInt(return_msg?.poll?.id || "0"),
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
