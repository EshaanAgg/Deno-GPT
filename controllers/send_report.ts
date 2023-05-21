import { customContext } from "../types.ts";
import { DeckStatType, get_decks_with_stats } from "./utilities.ts";
import { randomShuffle, toTitleCase } from "../helper.ts";

const convertNumberToEmoji = (ctx: customContext, n: number) => {
  const s = n.toString();
  let r = "";
  const emojis = [
    ctx.emoji`${"keycap_digit_zero"}`,
    ctx.emoji`${"keycap_digit_one"}`,
    ctx.emoji`${"keycap_digit_two"}`,
    ctx.emoji`${"keycap_digit_three"}`,
    ctx.emoji`${"keycap_digit_four"}`,
    ctx.emoji`${"keycap_digit_five"}`,
    ctx.emoji`${"keycap_digit_six"}`,
    ctx.emoji`${"keycap_digit_seven"}`,
    ctx.emoji`${"keycap_digit_eight"}`,
    ctx.emoji`${"keycap_digit_nine"}`,
  ];
  for (let i = 0; i < s.length; i++) r += emojis[parseInt(s[i])];
  return r;
};

export const send_report = async (userId: string, ctx: customContext) => {
  const decks = await get_decks_with_stats(userId);
  const deckStats = randomShuffle(decks);

  let message =
    "You have been 🎉amazing🎉 on the app! Here is a brief deck-wise summary of your preparation 🏀:\n\n";

  deckStats.forEach((deck: DeckStatType) =>
    message += `🗂️${toTitleCase(deck.deck.replace("_", " "))}

Accuracy: ${convertNumberToEmoji(ctx, deck.accuracy)} %
Last Practiced: ${
      deck.lastSolved == 10000
        ? "Haven't started yet!"
        : (convertNumberToEmoji(ctx, deck.lastSolved) +
          " days ago")
    }

`
  );
  await ctx.api.sendMessage(userId, message);
};
