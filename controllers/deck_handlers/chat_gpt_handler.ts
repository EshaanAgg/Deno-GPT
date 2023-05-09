import { randomSample } from "../../helper.ts";
import supabase from "../../supabaseClient.ts";

interface QuestionInterface {
  id: string;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  ans: number;
}

const get_session_entry = (q: QuestionInterface) => {
  const options = [q.A, q.B, q.C, q.D];
  const option_ids = options.map((_, index) => `${q.id}-${index}`);
  return [q.question, options, option_ids, options[q.ans], option_ids[q.ans]];
};

export const chat_gpt_handler = async (
  max_per_day: number
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const { data } = await supabase.from("chatgpt").select("*");
  console.log("D1", data);
  const chosen_questions: QuestionInterface[] = randomSample(
    data!,
    max_per_day
  );
  console.log("D2", chosen_questions);
  return chosen_questions.map((ques: QuestionInterface) =>
    get_session_entry(ques)
  );
};
