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
import { BOT_NAME, cmd, decks } from "./constants.ts";
import { pick_deck } from "./controllers/pick_deck.ts";
import { new_deck } from "./controllers/new_deck.ts";
import { send_help } from "./controllers/utilities.ts";
import { chatDescription, customContext } from "./types.ts";

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
      // deno-lint-ignore prefer-const
      let obj = { chatDescription: [0, "", [], 0, 0, 0] as chatDescription };
      return obj;
    },
  })
);

bot.on("callback_query:data", async (ctx: customContext) => {
  const data = ltrim(ctx.callbackQuery?.data || "", "/");
  const message_id = ctx.callbackQuery?.message?.message_id || 0;
  if (decks[data] !== undefined) {
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

bot.command(
  "help",
  async (ctx: customContext) => await send_help(ctx.msg?.chat?.id || 0, ctx)
);
bot.command(
  "start",
  async (ctx: customContext) => await send_help(ctx.msg?.chat?.id || 0, ctx)
);

bot.on("poll_answer", async (ctx: customContext) => {
  const poll_id = ctx.update?.poll_answer?.poll_id || -1;
  const opts_id = ctx.update?.poll_answer?.option_ids;
  const id = ctx.update?.poll_answer?.user?.id || 0;
  if (poll_id == ctx.session.chatDescription[5]) {
    await pollCreator(id, ctx);
  }
  await supabase
    .from("PollStats")
    .update({ choice: opts_id })
    .eq("poll_id", poll_id);
});

bot.command("random", async (ctx: customContext) => {
  await new_deck(ctx.msg?.chat.id || 0, ctx);
});

const handleUpdate = webhookCallback(bot, "std/http");

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