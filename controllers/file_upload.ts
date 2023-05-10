import { customContext } from "../types.ts";
import { ADMIN_USER_IDS } from "../constants.ts";
import pdfjsLib from "npm:pdfjs-dist@^3.6.172";

export const file_upload_handler = async (ctx: customContext) => {
  const file = await ctx.getFile();
  const path = file.file_path;

  const userId = ctx.msg!.chat.id;
  if (!ADMIN_USER_IDS!.includes(userId.toString()))
    ctx.reply(
      "Hi! You aren't currently authorised to upload files to the bot. Contact the admins if you think this is a mistake."
    );

  await ctx.api.sendMessage(
    userId,
    "Thanks for the upload! We will try to parse it to generate all the questions! "
  );

  if (path!.slice(-4) != ".pdf")
    ctx.reply(
      "Currenlty we only support .pdf files for making questions! Please try again with the correct file type."
    );

  const doc = await pdfjsLib.getDocument(path).promise;
  const page1 = await doc.getPage(1);
  const content = await page1.getTextContent();
  const strings = content.items.map(function (item) {
    return item.str;
  });
  ctx.reply(strings);
};
