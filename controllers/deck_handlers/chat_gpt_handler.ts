import { randomShuffle } from "../../helper.ts";
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

const is_valid_question = (q: QuestionInterface): boolean => {
  return (
    q.question.length < 100 &&
    q.A.length < 100 &&
    q.B.length < 100 &&
    q.C.length < 10 &&
    q.D.length < 100
  );
};

export const chat_gpt_handler = async (
  number_of_questions: number
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const { data, error } = await supabase.from("chatgpt").select("*");
  if (error) console.log(error);

  const shuffled_questions: QuestionInterface[] = randomShuffle(data!);
  const questions = [];

  let index = 0;
  while (questions.length < number_of_questions) {
    if (is_valid_question(shuffled_questions[index]))
      questions.push(get_session_entry(shuffled_questions[index]));
    index++;
  }

  return questions;
};
