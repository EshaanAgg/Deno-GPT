import { customContext } from "../types.ts";
import { ADMIN_USER_IDS } from "../constants.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@^1.11.1?dts";

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
  const pages = await pdfDoc.getPages();
  let textContent = "";

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    textContent += strings.join(" ");
  }

  ctx.reply(textContent);
};
