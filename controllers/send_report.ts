import { customContext } from "../types.ts";
import { DeckStatType, get_decks_with_stats } from "./utilities.ts";
import { randomShuffle, toTitleCase } from "../helper.ts";

const convertNumberToEmoji = (n: number) => {
  const s = n.toString();
  let r = "";
  const emojis = "0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣";
  for (let i = 0; i < s.length; i++) r += emojis[parseInt(s[i])];
  return r;
};

export const send_report = async (userId: string, ctx: customContext) => {
  const decks = await get_decks_with_stats(userId);
  const deckStats = randomShuffle(decks);

  let message =
    "You have been <b>amazing</b> on the app! Here is a brief deck-wise summary of your preparation:\n\n";

  deckStats.forEach((deck: DeckStatType) =>
    message += `<u>${toTitleCase(deck.deck.replace("_", " "))} :</u>
<tg-spoiler>Accuracy: <b>${convertNumberToEmoji(deck.accuracy)} %</b>
Last Practiced: <b>${
      deck.lastSolved == 10000 ? "NA" : (convertNumberToEmoji(deck.lastSolved) +
        " days ago")
    }</b>
</tg-spoiler>
`
  );

  await ctx.api.sendMessage(userId, message, {
    parse_mode: "HTML",
  });
};
