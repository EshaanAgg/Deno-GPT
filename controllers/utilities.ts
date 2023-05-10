import supabase from "../supabaseClient.ts";
import { BOT_NAME, texts } from "../constants.ts";
import { customContext } from "../types.ts";

export const get_progress = (i = "1", total = 5) => {
  const solids = ["🟥", "🟧", "🟨", "🟩", "🟦"];
  const blank = "⬜️";
  const unit = Math.round(total / solids.length);

  let n = parseInt(i);
  const percent = Math.round((100 * n) / total);

  if (n - 1 < 0) n += solids.length;
  const solid = solids[n - 1];

  return (
    solid.repeat(n * unit) + blank.repeat((total - n) * unit) + `  ${percent}%`
  );
};

export const send_help = async (id: number, ctx: customContext) => {
  const msg = await ctx.api.sendMessage(id, texts["help"]);
  try {
    supabase.from("TempMsgs").insert({
      user: ctx.msg?.chat?.id || "0",
      mid: msg?.message_id,
      botName: BOT_NAME,
    });
    await supabase.from("TempMsgs").insert({
      user: ctx.msg?.chat?.id,
      mid: ctx.msg?.message_id,
      botName: BOT_NAME,
    });
  } catch (err) {
    console.log(err);
  }
};

export const toggle_show_all_questions = async (
  id: number,
  ctx: customContext
) => {
  ctx.session.showAllQuestions = !ctx.session.showAllQuestions;

  let message = "";
  if (ctx.session.showAllQuestions)
    message = "You will see all the questions for each deck!";
  else
    message = "You will only see a limited number (5) questions for each deck!";

  message +=
    "\n\nYou can toggle this functionality by using this command again!";

  const msg = await ctx.api.sendMessage(id, message);
  try {
    supabase.from("TempMsgs").insert({
      user: ctx.msg?.chat?.id || "0",
      mid: msg?.message_id,
      botName: BOT_NAME,
    });
    await supabase.from("TempMsgs").insert({
      user: ctx.msg?.chat?.id,
      mid: ctx.msg?.message_id,
      botName: BOT_NAME,
    });
  } catch (err) {
    console.log(err);
  }
};
