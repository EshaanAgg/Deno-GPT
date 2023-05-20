import { customContext } from "../types.ts";
import { get_decks_with_stats } from "./utilities.ts";

export const send_report = async (userId: string, ctx: customContext) => {
  const deckStats = await get_decks_with_stats(userId);
  console.log(deckStats);
  await ctx.api.sendMessage(userId, `Testing *markdown* features _yoo_`, {
    parse_mode: "MarkdownV2",
  });
};
