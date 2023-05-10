import supabase from "../supabaseClient.ts";
import { BOT_NAME, texts } from "../constants.ts";
import { customContext } from "../types.ts";

export const get_progress = (i = "1", total = 5) => {
  const solids = ["🟥", "🟧", "🟨", "🟩", "🟦"];
  const blank = "⬜️";

  const progress = [];
  for (let i = 0; i < 10; i++) progress.push(blank);

  const n = parseInt(i);
  const percent = Math.round((100 * n) / total);

  const number_of_boxes_to_fill = Math.round(percent / 10);
  const box_index =
    number_of_boxes_to_fill % 2
      ? Math.max(0, (number_of_boxes_to_fill - 3) / 2)
      : Math.max((number_of_boxes_to_fill - 2) / 2, 0);

  for (let i = 0; i < number_of_boxes_to_fill; i++)
    progress[i] = solids[box_index];

  return `\n${progress.join("")}\n${percent}% done!`;
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
