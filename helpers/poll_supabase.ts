import { customContext, PollInfoType } from "../types.ts";
import supabase from "../supabaseClient.ts";

export const update_question_status = async (
  ctx: customContext,
  poll_id: string,
  chosen_option: number,
  userId: string,
) => {
  const pollInfo: PollInfoType[] = ctx.session.pollInfo;
  for (let i = 0; i < pollInfo.length; i++) {
    if (pollInfo[i].pollId.toString() === poll_id.toString()) {
      // Store the user response in the Supabase database
      await supabase
        .from("user_progress")
        .update({ correct: chosen_option == pollInfo[i].correctAnsIndex })
        .eq("user", userId.toString())
        .eq("question", pollInfo[i].questionId);

      // Store in the user context
      ctx.session.solvedCorrectly +=
        chosen_option == pollInfo[i].correctAnsIndex ? 1 : 0;

      // Delete the entry from the pollInfo object to save memory
      pollInfo.splice(i, 1);
      ctx.session.pollInfo = pollInfo;
      return;
    }
  }
};
