import supabase from "../supabaseClient.ts";
import { allDecks, BOT_NAME, texts } from "../constants.ts";
import { counter, mostCommon, toTitleCase } from "../helper.ts";
import { customContext } from "../types.ts";

import { InlineKeyboard } from "https://deno.land/x/grammy@v1.11.2/mod.ts";

export const pick_deck = async (id: number, ctx: customContext) => {
  let welcome_msg;
  const res = await supabase.from("BotUsers").select("*").eq("t_id", id);

  if (res.data === null || res.data.length == 0) {
    console.log("Creating a new user");
    const _ = await supabase.from("BotUsers").insert({
      t_id: id,
      fname: ctx.from?.first_name || "",
      lname: ctx.from?.last_name || "",
      uname: ctx.from?.username || "",
    });
    // console.log(response);
    welcome_msg = await ctx.api.sendMessage(id, texts["welcome"]);
  } else {
    welcome_msg = await ctx.api.sendMessage(id, texts["welcome_back"]);
  }

  const choices = ["✅", "🔄", "🆕"];
  const { data } = await supabase
    .from("PollStats")
    .select("deck")
    .eq("user", id);

  // deno-lint-ignore no-explicit-any
  const deckslist = data?.map((d: any) => d.deck) || [];
  const deckstats = counter(deckslist);
  const mostCommonDecks = mostCommon(deckstats, 2);
  // deno-lint-ignore prefer-const
  let deckcolor: { [key: string]: string } = {};

  allDecks.forEach((deck) => {
    if (deckstats.deck !== undefined) deckcolor[deck] = choices[2];
    else if (mostCommonDecks.includes(deck)) deckcolor[deck] = choices[0];
    else deckcolor[deck] = choices[1];
  });

  const keyboard = new InlineKeyboard();
  let index = 0;
  allDecks.forEach((deck) => {
    keyboard.text(
      `${deckcolor[deck]} ${toTitleCase(deck.replace("_", " "))}`,
      `/${deck}`,
    );
    if (index % 2 == 1) keyboard.row();
    index++;
  });

  const msg = await ctx.api.sendMessage(id, "Choose a deck to revise!", {
    reply_markup: keyboard,
  });
  try {
    await supabase.from("TempMsgs").insert({
      user: id,
      mid: msg.message_id || 0,
      botName: BOT_NAME,
    });
    await supabase.from("TempMsgs").insert({
      user: id,
      mid: ctx.msg?.message_id || 0,
      botName: BOT_NAME,
    });
    await supabase.from("TempMsgs").insert({
      user: id,
      mid: welcome_msg?.message_id || 0,
      botName: BOT_NAME,
    });
  } catch (err) {
    console.log(err);
  }
};
