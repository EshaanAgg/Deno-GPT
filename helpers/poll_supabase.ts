import { customContext, PollInfoType } from "../types.ts";
import supabase from "../supabaseClient.ts";

export const update_question_status = async (
  ctx: customContext,
  poll_id: string,
  chosen_option: number,
  userId: string
) => {
  const pollInfo: PollInfoType[] = ctx.session.pollInfo;
  console.log("pole info", pollInfo);
  for (let i = 0; i < pollInfo.length; i++)
    if (pollInfo[i].pollId.toString() === poll_id.toString()) {
      console.log("MATCH FOUND");
      const { error } = await supabase
        .from("user_progress")
        .update({ correct: chosen_option == pollInfo[i].correctAnsIndex })
        .eq("user", userId.toString())
        .eq("question", pollInfo[i].questionId);

      if (error)
        console.log(
          "Unexpected error occured in Supabase Call in update_question_status handler:\n",
          error
        );
      return;
    }
  console.log("No match found");
};
