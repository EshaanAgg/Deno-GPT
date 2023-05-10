import { randomChoice } from "../helper.ts";
import { allDecks, BOT_NAME, MAX_PER_DAY } from "../constants.ts";
import supabase from "../supabaseClient.ts";
import { pollCreator } from "./poll_creator.ts";
import { customContext, chatDescription } from "../types.ts";
import { default_handler } from "./deck_handlers/default_handler.ts";
import { chat_gpt_handler } from "./deck_handlers/chat_gpt_handler.ts";

export const new_deck = async (id: number, ctx: customContext, deck = "") => {
  ctx.session.chatDescription = [0, "", [], 0, 0, 0] as chatDescription;

  // Randomly select a deck if none is provided
  if (deck === "") deck = randomChoice(allDecks);

  // TODO: Deprecated the serive for custom MAX_PER_DAY for each user. Need to restore it
  const max_per_day = MAX_PER_DAY;

  // deno-lint-ignore no-explicit-any
  let session: any[][] = [];

  if (deck === "Chat_GPT")
    session = await chat_gpt_handler(max_per_day, ctx.session.showAllQuestions);
  else
    session = await default_handler(
      deck,
      max_per_day,
      ctx.session.showAllQuestions
    );

  ctx.session.chatDescription = [0, deck, session, 0, 0, 0];

  // deno-lint-ignore no-unused-vars
  const poll_msg_ids = await pollCreator(id, ctx);

  try {
    const _ = await supabase.from("TempMsgs").insert({
      user: id,
      mid: ctx.msg?.message_id || "0",
      botName: BOT_NAME,
    });
  } catch (err) {
    console.log(err);
  }

  // TODO : Add code to manage messages in TempMsgs
  // var { data } = await supabase.from("TempMsgs").select("*").eq("user", id);
  // if (data) {
  // 	data.forEach((row) => {
  // 		try {
  // 			if (poll_msg_ids != undefined && !poll_msg_ids.includes(row["mid"]))
  // 				ctx.api.deleteMessage(id, row["mid"]);
  // 		} catch (err) {
  // 			console.log(err);
  // 		}
  // 	});
  // }
};
