import { randomChoice, randomSample, randomShuffle } from "../helper.ts";
import {
  allDecks,
  BOT_NAME,
  decks,
  MAX_PER_DAY,
  N_OPTIONS,
} from "../constants.ts";
import supabase from "../supabaseClient.ts";
import { pollCreator } from "./poll_creator.ts";
import { customContext, chatDescription } from "../types.ts";

export const new_deck = async (id: number, ctx: customContext, deck = "") => {
  ctx.session.chatDescription = [0, "", [], 0, 0, 0] as chatDescription;

  if (deck === "") deck = randomChoice(allDecks);
  let max_per_day = MAX_PER_DAY;

  const response1 = await supabase.from("max_per_day").select("*");
  if (response1.data) max_per_day = response1.data[0]["max_per_day"];
  if (response1.error) console.log("ERROR...", response1.error);

  let { data } = await supabase.from(deck).select("*");
  if (!data) data = [];

  // deno-lint-ignore prefer-const
  let session = [];
  let attempts = 0;

  while (session.length < max_per_day) {
    console.log(session.length);
    attempts += 1;
    const [template, fill_col, ans_col] = randomChoice(decks[deck]);
    let qs = randomSample(data, N_OPTIONS);

    const ans = String(qs[0][ans_col]);
    const fill = qs[0][fill_col];
    const ans_id = qs[0]["id"];
    qs = randomShuffle(qs);

    // deno-lint-ignore prefer-const
    let options: string[] = [];
    // deno-lint-ignore prefer-const
    let option_ids: string[] = [];
    let max_option_length = -1;

    qs.forEach((q) => {
      options.push(String(q[ans_col]));
      option_ids.push(q["id"]);
      max_option_length = Math.max(max_option_length, String(q[ans]).length);
    });

    // deno-lint-ignore prefer-const
    let ans_array: string[] = [];
    session.forEach((s) => ans_array.push(s[2]));

    if (!ans_array.includes(ans) && max_option_length < 95) {
      session.push([
        template.replace("[MASK]", fill),
        options,
        ans,
        option_ids,
        ans_id,
      ]);
    } else {
      console.log(`Skipped this attempt with options = ${options}`);
    }
  }

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
