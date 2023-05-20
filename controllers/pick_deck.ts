import supabase from "../supabaseClient.ts";
import { BOT_NAME, texts } from "../constants.ts";
import { toTitleCase } from "../helper.ts";
import { customContext } from "../types.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.11.2/mod.ts";
import { DeckStatType, get_decks_with_stats } from "./utilities.ts";

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

  const frequencyEmojis = ["🔁", "🆕", "✅"];
  const deckStats = await get_decks_with_stats(id);

  const keyboard = new InlineKeyboard();
  deckStats.forEach((deck: DeckStatType) => {
    let leadingEmoji = "";
    if (deck.lastSolved <= 3) leadingEmoji = frequencyEmojis[2];
    else if (deck.lastSolved <= 7) leadingEmoji = frequencyEmojis[0];
    else leadingEmoji = frequencyEmojis[1];

    keyboard.text(
      `${leadingEmoji} ${toTitleCase(deck.deck.replace("_", " "))}`,
      `/${deck.deck}`,
    );
    keyboard.row();
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
