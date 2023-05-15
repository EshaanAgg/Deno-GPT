import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {
  Bot,
  Context,
  session,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.11.2/mod.ts";
import { ltrim } from "./helper.ts";
import supabase from "./supabaseClient.ts";
import { pollCreator } from "./controllers/poll_creator.ts";
import { BOT_NAME, allDecks, cmd } from "./constants.ts";
import { pick_deck } from "./controllers/pick_deck.ts";
import { new_deck } from "./controllers/new_deck.ts";
import { send_help, set_settings } from "./controllers/utilities.ts";
import { set_question_preference } from "./controllers/set_question_preference.ts";
import { chatDescription, customContext } from "./types.ts";
import { file_upload_handler } from "./controllers/file_upload.ts";
import { update_question_status } from "./helpers/poll_supabase.ts";

const bot = new Bot<customContext>(Deno.env.get("TELEGRAM_BOT_TOKEN") || "");

function getSessionKey(ctx: Context): string | undefined {
  return (
    ctx.from?.id.toString() ||
    ctx.msg?.chat.id.toString() ||
    ctx.update?.poll_answer?.user.id.toString()
  );
}

bot.use(
  session({
    getSessionKey,
    initial: () => {
      const obj = {
        chatDescription: [0, "", [], 0, 0, 0] as chatDescription,
        questionPreference: 5,
        pollInfo: [],
      };
      return obj;
    },
  })
);

bot.on("callback_query:data", async (ctx: customContext) => {
  const data = ltrim(ctx.callbackQuery?.data || "", "/");
  const message_id = ctx.callbackQuery?.message?.message_id || 0;
  if (allDecks.indexOf(data) !== -1) {
    await ctx.answerCallbackQuery({
      text: "Loading your session!",
    });
    await new_deck(ctx.msg?.chat?.id || 0, ctx, data);
  } else {
    await ctx.answerCallbackQuery({
      text: "I'm sorry I didn't get that. Please choose a command from the dropdown.",
    });
  }
  try {
    await supabase.from("TempMsgs").insert({
      user: ctx.msg?.chat?.id || "0",
      mid: message_id,
      botName: BOT_NAME,
    });
  } catch (err) {
    console.log(err);
  }
});

bot.command(cmd, async (ctx: customContext) => {
  await pick_deck(ctx.msg?.chat?.id || 0, ctx);
});

bot.command("settings", async (ctx: customContext) => {
  await set_settings(ctx.msg?.chat?.id || 0, ctx);
});

bot.command(
  "help",
  async (ctx: customContext) => await send_help(ctx.msg?.chat?.id || 0, ctx)
);

bot.command(
  "start",
  async (ctx: customContext) => await send_help(ctx.msg?.chat?.id || 0, ctx)
);

bot.on("poll_answer", async (ctx: customContext) => {
  const poll_id = ctx.update?.poll_answer?.poll_id;
  const opts_id = ctx.update?.poll_answer?.option_ids;
  const id = ctx.update?.poll_answer?.user?.id || 0;

  const chosen_option = ctx.update?.poll_answer?.option_ids[0];
  console.log("Called update_ques_status");
  await update_question_status(ctx, poll_id!, chosen_option!, id.toString());
  console.log("Done with update_ques_status");

  console.log("pollid", poll_id);
  console.log("cd", ctx.session.chatDescription[5]);
  if (poll_id == ctx.session.chatDescription[5]) {
    await pollCreator(id, ctx);
  }
  await supabase
    .from("PollStats")
    .update({ choice: opts_id })
    .eq("poll_id", poll_id);
});

bot.on(":file", async (ctx: customContext) => {
  await file_upload_handler(ctx);
});

bot.command("random", async (ctx: customContext) => {
  await new_deck(ctx.msg?.chat.id || 0, ctx);
});

bot.on("message", async (ctx: customContext) => {
  const message: string = ctx.message!.text!;
  if (message.indexOf("setQuestion:") != -1)
    await set_question_preference(message, ctx);
  else ctx.reply("Unrecognized command!");
});

const handleUpdate = webhookCallback(bot, "std/http", {
  timeoutMilliseconds: 60 * 1000,
});

serve(async (req) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
  }
  return new Response();
});

bot.catch((err) => {
  console.log("ERROR IN THE GLOBAL HANDLER");
  console.log(err);
  console.log("END OF ERROR");
});
