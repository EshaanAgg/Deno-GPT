import { customContext } from "../types.ts";
import { DeckStatType, get_decks_with_stats } from "./utilities.ts";
import { toTitleCase } from "../helper.ts";

export const send_report = async (userId: string, ctx: customContext) => {
  const deckStats = await get_decks_with_stats(userId);

  let message =
    "You have been amazing on the app! Here is a brief deck-wise summary of your preparation:\n\n";

  deckStats.forEach((deck: DeckStatType) =>
    message += `<u>${toTitleCase(deck.deck.replace("_", " "))}</u>
<tg-spoiler>Accuracy: <b>${deck.accuracy}</b>
Last Practiced: <b>${
      deck.lastSolved == 10000
        ? "NA"
        : (deck.lastSolved.toString() + " days ago")
    }</b>
</tg-spoiler>
`
  );

  console.log(message);
  await ctx.api.sendMessage(userId, message, {
    parse_mode: "HTML",
  });
};
