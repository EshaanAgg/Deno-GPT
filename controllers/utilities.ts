import supabase from "../supabaseClient.ts";
import { BOT_NAME, texts } from "../constants.ts";
import { customContext } from "../types.ts";

export const get_progress = (n: number, total: number) => {
  const solids = ["🟥", "🟧", "🟨", "🟦", "🟩", "🟩"];
  const blank = "⬜️";

  const progress = [];
  for (let i = 0; i < 10; i++) progress.push(blank);

  const percent = Math.round((100 * n) / total);

  const number_of_boxes_to_fill = Math.round(percent / 10);
  const box_index = Math.floor((percent - 0.01) / 20);

  for (let i = 0; i < number_of_boxes_to_fill; i++) {
    progress[i] = solids[box_index];
  }

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

export const set_settings = async (id: number, ctx: customContext) => {
  let message = "";
  if (ctx.session.questionPreference == 0) {
    message =
      "You will currently see all the questions that we listed for a deck.";
  } else if (ctx.session.questionPreference == -1) {
    message =
      "You will currently see all the questions which you had answered incorrectly from the previous sessions when you choose a deck.";
  } else {
    message =
      `You will only see ${ctx.session.questionPreference} randomly chosen questions for a deck.`;
  }

  message += `\n\nYou can change this behaviour by sending the following text:\n
setQuestion:ALL (Will show all questions in a deck)\n
setQuestion:INC (Will show all questions which you had attempted incorrectly previously)\n
setQuestion:XY  (Will show XY questions for each deck. Note that XY must always be a two digit number like 05, 10, 99 etc)\n\n
Please note that all the commands are case sensitive.`;

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
