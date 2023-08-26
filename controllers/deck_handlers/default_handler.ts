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

// Return the object that is to be stored in the session
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

// Validate question according to Telegram specs
const is_valid_question = (q: QuestionInterface): boolean => {
  return (
    q.question.length < 100 &&
    q.A.length < 100 &&
    q.B.length < 100 &&
    q.C.length < 100 &&
    q.D.length < 100
  );
};

// Utility to transform question options
const transform_question_options = (
  q: QuestionInterface,
): QuestionInterface => {
  if (q.A.slice(0, 3) == "A. ") q.A = q.A.slice(3);
  if (q.B.slice(0, 3) == "B. ") q.B = q.B.slice(3);
  if (q.C.slice(0, 3) == "C. ") q.C = q.C.slice(3);
  if (q.D.slice(0, 3) == "D. ") q.D = q.D.slice(3);
  return q;
};

// Handle the deck according in Normal mode
const regularHandler = async (
  deck: string,
  question_preference: number,
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const { data, error } = await supabase
    .from("random_questions")
    .select("*")
    .eq("deck", deck)
    .eq("confirmed", true);

  if (error) console.log(error);

  if (question_preference == 0) question_preference = 100;

  const shuffled_questions: QuestionInterface[] = data!;
  const questions = [];

  let index = 0;
  while (
    questions.length < question_preference &&
    index < shuffled_questions.length
  ) {
    if (is_valid_question(shuffled_questions[index])) {
      questions.push(
        get_session_entry(
          transform_question_options(shuffled_questions[index]),
        ),
      );
    }
    index++;
  }

  return questions;
};

// Handle the deck according in incorrect mode
const incorrectHandler = async (
  deck: string,
  userId: number,
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const { data: incorrectQuestionObjects } = await supabase
    .from("user_progress")
    .select("question")
    .eq("user", userId)
    .eq("correct", false);

  const incorrectQuestions = incorrectQuestionObjects!.map(
    (ques) => ques.question,
  );

  const { data } = await supabase
    .from("random_questions")
    .select("*")
    .eq("deck", deck)
    .eq("confirmed", true)
    .in("id", incorrectQuestions!);

  const shuffled_questions: QuestionInterface[] = data || [];
  const questions = [];

  let index = 0;
  while (questions.length < 100 && index < shuffled_questions.length) {
    if (is_valid_question(shuffled_questions[index])) {
      questions.push(
        get_session_entry(
          transform_question_options(shuffled_questions[index]),
        ),
      );
    }
    index++;
  }

  return questions;
};

// Map which handler to use
export const default_handler = async (
  deck: string,
  question_preference: number,
  userId: number,
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  if (question_preference != -1) {
    return await regularHandler(deck, question_preference);
  }

  return await incorrectHandler(deck, userId);
};
