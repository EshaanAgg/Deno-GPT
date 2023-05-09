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
  return [q.question, options, options[q.ans], option_ids, option_ids[q.ans]];
};

export const chat_gpt_handler = async (
  max_per_day: number
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const { data, error } = await supabase.from("chatgpt").select("*");
  if (error) console.log(error);

  const chosen_questions: QuestionInterface[] = randomSample(
    data!,
    max_per_day
  );

  return chosen_questions.map((ques: QuestionInterface) =>
    get_session_entry(ques)
  );
};
