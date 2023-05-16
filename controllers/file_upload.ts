import { customContext } from "../types.ts";

const API_BASE_URL = "https://v2.convertapi.com/convert/pdf/to/txt";
const EDGE_FUNCTION_URL = "";

export const file_upload_handler = async (ctx: customContext) => {
  const file = await ctx.getFile();
  const download_file_url = `https://api.telegram.org/file/bot${
    Deno.env.get(
      "TELEGRAM_BOT_TOKEN",
    )
  }/${file.file_path}`;

  console.log(download_file_url);

  const userId = ctx.msg!.chat.id;

  fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      download_file_url,
      userId,
    }),
  });

  await ctx.reply("The request for content generation has been made!");
};
