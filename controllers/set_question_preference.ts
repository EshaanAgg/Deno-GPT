import { customContext } from "../types.ts";

export const set_question_preference = async (
  message: string,
  ctx: customContext
) => {
  if (message.slice(0, 15) === "setQuestion:ALL") {
    ctx.session.questionPreference = 0;
    await ctx.reply(
      "You will now see all the questions for a particular deck!"
    );
    return;
  }
  if (message.slice(0, 15) === "setQuestion:INC") {
    ctx.session.questionPreference = -1;
    await ctx.reply(
      "You will now see all the questions which you solved incorrectly for a particular deck!"
    );
    return;
  }

  if (message.slice(0, 12) === "setQuestion:") {
    const n = Number(message.slice(12, 14));
    if (isNaN(n)) {
      ctx.reply(
        "Incorrect argument for the number of questions to show! Please try again."
      );
      return;
    }
    ctx.session.questionPreference = n;
    ctx.reply("Question preference settings changed successfully!");
    return;
  }

  ctx.reply(
    "No valid arguments could be paresed from the setQuestion command! Please try again with the format provided."
  );
};
