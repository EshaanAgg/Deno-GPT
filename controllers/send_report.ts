import { customContext } from "../types.ts";
import { DeckStatType, get_decks_with_stats } from "./utilities.ts";
import { toTitleCase } from "../helper.ts";

export const send_report = async (userId: string, ctx: customContext) => {
  await ctx.reply(
    "Thanks for using this option! Crunching those numbers for you now....",
  );

  const decks = await get_decks_with_stats(userId);
  const payload: {
    deck: string;
    accuracy: number;
  }[] = [];

  decks.forEach((deck: DeckStatType) =>
    payload.push({
      deck: toTitleCase(deck.deck.replace("_", "\n")),
      accuracy: deck.accuracy,
    })
  );

  await fetch(
    `https://graphy-saras.netlify.app/.netlify/functions/sendReport`,
    {
      method: "POST",
      body: JSON.stringify({
        chatId: userId,
        data: payload,
      }),
    },
  );
};
