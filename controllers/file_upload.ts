import { customContext } from "../types.ts";
import supabase from "../supabaseClient.ts";

const EDGE_FUNCTION_URL =
  "https://gomhtyyltrqyoflqrgvy.functions.supabase.co/question_generate";

export const file_upload_handler = async (ctx: customContext) => {
  const file = await ctx.getFile();
  const download_file_url = `https://api.telegram.org/file/bot${
    Deno.env.get(
      "TELEGRAM_BOT_TOKEN",
    )
  }/${file.file_path}`;

  ctx.session.uploadedFileLink = download_file_url;

  await ctx.reply(
    `The file upload was successful! Please choose a name for the deck. Set a text of the form "DeckName:<Your Alphanumeric Deck Name in Titlecase>" to continue with the request.`,
  );
};

export const upload_new_deck = async (message: string, ctx: customContext) => {
  const deckName = message.slice(9, message.length).toString().trim();
  const userId = ctx.msg!.chat.id;

  const { data: deckData } = await supabase.from("verified_decks").select(
    "*",
  );
  const isExisitingDeck = deckData!.some((deck) =>
    deck.deck.toString().trim() == deckName
  );

  await ctx.reply(`Adding the questions under the deck name: ${deckName}`);

  if (isExisitingDeck) {
    await ctx.reply(
      "Caution! A deck with the same name already exists and you will be appending questions to the same!",
    );
  }

  fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      download_file_url: ctx.session.uploadedFileLink,
      userId,
      deckName,
    }),
  });

  await ctx.reply("The request for content generation has been made!");
};
