import { customContext } from "../types.ts";
import { ADMIN_USER_IDS } from "../constants.ts";

const API_BASE_URL = "https://v2.convertapi.com/convert/pdf/to/txt";

export const file_upload_handler = async (ctx: customContext) => {
  const file = await ctx.getFile();
  const download_file_url = `https://api.telegram.org/file/bot${Deno.env.get(
    "TELEGRAM_BOT_TOKEN"
  )}/${file.file_path}`;

  const userId = ctx.msg!.chat.id;
  if (!ADMIN_USER_IDS!.includes(userId.toString()))
    ctx.reply(
      "Hi! You aren't currently authorised to upload files to the bot. Contact the admins if you think this is a mistake!"
    );

  await ctx.api.sendMessage(
    userId,
    "Thanks for the upload! We will try to parse it to generate all the questions! "
  );

  if (file.file_path!.slice(-4) != ".pdf")
    ctx.reply(
      "Currently we only support .pdf files for making questions! Please try again with the correct file type."
    );

  const pdf_to_text_request = new Request(
    `${API_BASE_URL}?Secret=${Deno.env.get(
      "PDF_TO_TEXT_API_KEY"
    )}&StoreFile=true&File=${download_file_url}`,
    {
      method: "POST",
    }
  );

  const pdf_to_text_response = await fetch(pdf_to_text_request);
  const pdf_to_text_json = await pdf_to_text_response.json();
  const text_url = pdf_to_text_json.Files.Url;

  const content_response = await fetch(text_url);
  const content = await content_response.text();

  await ctx.api.sendMessage(
    userId,
    "The content from the uploaded file has been successfully parsed. Generating questions now! "
  );
};
