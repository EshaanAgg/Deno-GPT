import supabase from "../supabaseClient.ts";
import { BOT_NAME, texts } from "../constants.ts";
import { toTitleCase } from "../helper.ts";
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

  const { data: userPerformance } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user", id);

  const { data: deckData } = await supabase.from("verified_decks").select("*");
  const allDecks = deckData!.map((deck) => deck.deck);

  const deckStats: {
    deck: string;
    accuracy: string;
    lastSolved: string;
  }[] = [];

  allDecks.forEach((deck) => {
    let isAdded = false;
    for (let i = 0; i < userPerformance!.length; i++) {
      const row = userPerformance![i];
      if (row.deck == deck) {
        const last = new Date(row.updated_at);
        const now = new Date();
        const daysPassed = Math.ceil(
          (now.getTime() - last.getTime()) / (1000 * 24 * 3600),
        );
        deckStats.push({
          deck,
          accuracy: row.accuracy.toString(),
          lastSolved: daysPassed.toString(),
        });
        isAdded = true;
        break;
      }
    }
    if (!isAdded) {
      deckStats.push({
        deck,
        accuracy: "NA",
        lastSolved: "NA",
      });
    }
  });

  const keyboard = new InlineKeyboard();
  deckStats.forEach((deck) => {
    keyboard.text(
      `${toTitleCase(deck.deck.replace("_", " "))}
      ${deck.accuracy}% | Last Solved: ${deck.lastSolved} Days ago`,
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
