import supabase from "../supabaseClient.ts";
import { toTitleCase } from "../helper.ts";
import { customContext } from "../types.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.11.2/mod.ts";

// Main handler to choose deck
export const verify_decks = async (ctx: customContext) => {
  const { data: deckData } = await supabase.from("unverified_decks").select(
    "*",
  );

  const decks = deckData!.map((deck) => deck.deckName);

  if (decks.length == 0) {
    await ctx.reply(
      `There are no questions that are unverified as of now! Victory!`,
    );
    return;
  }

  await ctx.reply(
    `There are ${decks.length} decks with unverified questions!`,
  );

  const keyboard = new InlineKeyboard();
  let index = 0;
  decks.forEach((deck) => {
    keyboard.text(
      toTitleCase(deck.replace("_", " ")),
      `/verify-${deck}`,
    );
    if (index % 2 == 1) keyboard.row();
    index++;
  });

  await ctx.api.sendMessage(
    ctx.msg?.chat?.id!,
    "Choose one of them to verify!",
    {
      reply_markup: keyboard,
    },
  );
};

// Provide the options for deck verification
export const handle_deck_verification = async (
  ctx: customContext,
  deck: string,
) => {
  let { data } = await supabase.from("random_unverified_questions").select(
    "*",
  ).eq(
    "deckName",
    deck,
  );

  data = data!.filter((que) =>
    que.A.toString().length < 100 && que.B.toString().length < 100 &&
    que.C.toString().length < 100 &&
    que.D.toString().length < 100
  );

  const questionCount = Math.min(10, data!.length);

  await ctx.reply(
    `A total of ${
      data!.length
    } question were found for this particular deck! You will be shown be ${questionCount} questions on the basis of which you can add or discard the whole deck.`,
  );

  for (let i = 0; i < questionCount; i++) {
    await ctx.api.sendPoll(
      ctx.msg!.chat.id,
      data![i].question,
      [
        data![i].A.toString(),
        data![i].B.toString(),
        data![i].C.toString(),
        data![i].D.toString(),
      ],
      {
        is_anonymous: false,
        type: "quiz",
        correct_option_id: data![i].ans,
        explanation: "Insert explanation here.",
      },
    );
  }

  const keyboard = new InlineKeyboard();
  keyboard.text(
    `✅ YES! Verify them all.`,
    `/approve-${deck}`,
  );
  keyboard.row();
  keyboard.text(`🔴 NOPE! Discard them all.`, `/discard-${deck}`);
  keyboard.row();
  keyboard.text(`➕ Show me more questions!`, `/more-${deck}`);

  await ctx.api.sendMessage(
    ctx.msg?.chat?.id!,
    "Choose one of these options!",
    {
      reply_markup: keyboard,
    },
  );
};

export const more_from_deck = async (
  ctx: customContext,
  deck: string,
) => {
  let { data } = await supabase.from("random_unverified_questions").select(
    "*",
  ).eq(
    "deckName",
    deck,
  );

  data = data!.filter((que) =>
    que.A.toString().length < 100 && que.B.toString().length < 100 &&
    que.C.toString().length < 100 &&
    que.D.toString().length < 100
  );

  const questionCount = Math.min(10, data!.length);

  for (let i = 0; i < questionCount; i++) {
    await ctx.api.sendPoll(
      ctx.msg!.chat.id,
      data![i].question,
      [
        data![i].A.toString(),
        data![i].B.toString(),
        data![i].C.toString(),
        data![i].D.toString(),
      ],
      {
        is_anonymous: false,
        type: "quiz",
        correct_option_id: data![i].ans,
        explanation: "Insert explanation here.",
      },
    );
  }

  const keyboard = new InlineKeyboard();
  keyboard.text(
    `✅ YES! Verify them all.`,
    `/approve-${deck}`,
  );
  keyboard.row();
  keyboard.text(`🔴 NOPE! Discard them all.`, `/discard-${deck}`);
  keyboard.row();
  keyboard.text(`➕ Show me more questions!`, `/more-${deck}`);

  await ctx.api.sendMessage(
    ctx.msg?.chat?.id!,
    "Choose one of these options!",
    {
      reply_markup: keyboard,
    },
  );
};

export const approve_deck = async (
  ctx: customContext,
  deck: string,
) => {
  let { data } = await supabase.from("chatgpt_generated").select("*").eq(
    "deckName",
    deck,
  );

  data = data!.filter((que) =>
    que.A.toString().length < 100 && que.B.toString().length < 100 &&
    que.C.toString().length < 100 &&
    que.D.toString().length < 100
  );

  const questions = data!.map((que) => ({
    question: que.question,
    A: que.A,
    B: que.B,
    C: que.C,
    D: que.D,
    ans: que.ans,
    deck,
    confirmed: true,
  }));
  console.log(deck);
  await supabase.from("chatgpt").insert(questions);
  await supabase.from("chatgpt_generated").delete().eq(
    "deckName",
    deck,
  );

  await ctx.reply("All the questions have been verified for this deck!");
};

export const discard_deck = async (
  ctx: customContext,
  deck: string,
) => {
  console.log(deck);

  await supabase.from("chatgpt_generated").delete().eq(
    "deckName",
    deck,
  );

  await ctx.reply("All the questions have been discarded for this deck!");
};
