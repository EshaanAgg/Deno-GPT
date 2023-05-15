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
  deck: string;
  confirmed: boolean;
}

const get_session_entry = (q: QuestionInterface) => {
  const options = [q.A, q.B, q.C, q.D];
  const option_ids = options.map((_, index) => `${q.id}-${index}`);
  return [
    q.question,
    q.id,
    options,
    options[q.ans],
    option_ids,
    option_ids[q.ans],
  ];
};

const is_valid_question = (q: QuestionInterface): boolean => {
  return (
    q.question.length < 100 &&
    q.A.length < 100 &&
    q.B.length < 100 &&
    q.C.length < 100 &&
    q.D.length < 100
  );
};

const transform_question_options = (
  q: QuestionInterface
): QuestionInterface => {
  if (q.A.slice(0, 3) == "A. ") q.A = q.A.slice(3);
  if (q.B.slice(0, 3) == "A. ") q.B = q.B.slice(3);
  if (q.C.slice(0, 3) == "A. ") q.C = q.C.slice(3);
  if (q.D.slice(0, 3) == "A. ") q.D = q.D.slice(3);
  return q;
};

export const default_handler = async (
  deck: string,
  number_of_questions: number
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const { data, error } = await supabase
    .from("chatgpt")
    .select("*")
    .eq("deck", deck)
    .eq("confirmed", true);
  if (error) console.log(error);

  // const shuffled_questions: QuestionInterface[] = randomShuffle(data!);
  // Remving the shuffling of question to check the status of history tracking
  const shuffled_questions: QuestionInterface[] = data;
  const questions = [];

  let index = 0;
  while (
    questions.length < number_of_questions &&
    index < shuffled_questions.length
  ) {
    if (is_valid_question(shuffled_questions[index]))
      questions.push(
        get_session_entry(transform_question_options(shuffled_questions[index]))
      );
    index++;
  }

  return questions;
};
