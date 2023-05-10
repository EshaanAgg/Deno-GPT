import { customContext } from "../types.ts";
import { ADMIN_USER_IDS } from "../constants.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@^1.11.1?dts";

async function getNames(currentPath: string) {
  const names: string[] = [];

  for await (const dirEntry of Deno.readDir(currentPath)) {
    const entryPath = `${currentPath}/${dirEntry.name}`;
    names.push(entryPath);

    if (dirEntry.isDirectory) {
      names.push(await getNames(entryPath));
    }
  }

  return names;
}

export const file_upload_handler = async (ctx: customContext) => {
  const file = await ctx.getFile();
  const path = file.file_path;
  console.log(getNames("./"));
  console.log(getNames("./../"));
  console.log(getNames("./../../"));
  const userId = ctx.msg!.chat.id;
  if (!ADMIN_USER_IDS!.includes(userId.toString()))
    ctx.reply(
      "Hi! You aren't currently authorised to upload files to the bot. Contact the admins if you think this is a mistake!"
    );

  await ctx.api.sendMessage(
    userId,
    "Thanks for the upload! We will try to parse it to generate all the questions! "
  );

  if (path!.slice(-4) != ".pdf")
    ctx.reply(
      "Currently we only support .pdf files for making questions! Please try again with the correct file type."
    );
  console.log(file);
  const pdfData = await Deno.readFile(`./../${path!}`);
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
