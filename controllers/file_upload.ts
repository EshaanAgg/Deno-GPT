import { customContext } from "../types.ts";
import { ADMIN_USER_IDS } from "../constants.ts";
import { PDFDocument } from "https://deno.land/x/pdf_lib/mod.ts";

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

  const pdfData = await Deno.readFile(path!);
  const pdfDoc = await PDFDocument.load(pdfData);
  const textContent = await pdfDoc.getText();

  ctx.reply(textContent);
};
