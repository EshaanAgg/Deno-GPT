import { randomChoice } from "../helper.ts";
import { allDecks } from "../constants.ts";
import { chatDescription, customContext } from "../types.ts";
import { default_handler } from "./deck_handlers/default_handler.ts";

export const new_deck = async (id: number, ctx: customContext, deck = "") => {
  ctx.session.chatDescription = [0, "", [], 0, 0, "0"] as chatDescription;

  // Randomly select a deck if none is provided
  if (deck === "") deck = randomChoice(allDecks);

  // deno-lint-ignore no-explicit-any
  let session: any[][] = [];

  session = await default_handler(deck, ctx.session.questionPreference, id);

  ctx.session.chatDescription = [0, deck, session, 0, 0, "0"];
  ctx.session.solvedCorrectly = 0;

  ctx.reply(
    `${session.length} questions would be displayed now on the basis of your question preference. `,
  );
};
