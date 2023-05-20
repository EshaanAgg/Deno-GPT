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

export type DeckStatType = {
  deck: string;
  accuracy: number;
  lastSolved: number;
};

export const get_decks_with_stats = async (id: string) => {
  const { data: userPerformance } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user", id);

  const { data: deckData } = await supabase.from("verified_decks").select("*");
  const allDecks = deckData!.map((deck) => deck.deck);

  const deckStats: DeckStatType[] = [];

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
          accuracy: row.accuracy,
          lastSolved: daysPassed,
        });
        isAdded = true;
        break;
      }
    }
    if (!isAdded) {
      deckStats.push({
        deck,
        accuracy: 0,
        lastSolved: 10000,
      });
    }
  });

  deckStats.sort((a, b) =>
    (b.accuracy / 2 + 10 * b.lastSolved) -
    (a.accuracy / 2 + 10 * a.lastSolved)
  );

  return deckStats;
};
