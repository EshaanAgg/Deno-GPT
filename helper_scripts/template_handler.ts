// deno-lint-ignore-file

import { randomSample, randomShuffle } from "../../helper.ts";
import supabase from "../../supabaseClient.ts";
import {
  decks,
  N_OPTIONS,
  MAXIMUM_QUESTIONS_IN_ONE_GO,
} from "../../constants.ts";

const generate_all_questions = async (deck: string) => {
  const question_templates = decks[deck];
  const { data: question_data } = await supabase.from(deck).select("*");

  const questions: string[][] = [];

  question_templates.forEach((template) => {
    question_data!.forEach((ques) => {
      const [question_string, fill_column, ans_column] = template;

      const ans = ques[ans_column];
      // Check if the ans option can be a valid option or not
      if (ans.length < 100) {
        const ans_id = ques["id"];

        // Array of ["Option Content", "Option ID"]
        const options = randomSample(question_data!, N_OPTIONS)
          .filter((ques) => ques["id"] != ans_id)
          .map((ques) => [ques[ans_column], ques["id"]])
          .filter((opt) => opt[0].length < 100);
        options.push([ans, ans_id]);
        randomShuffle(options);

        questions.push([
          question_string.replace("[MASK]", ques[fill_column]),
          options.map((opt) => opt[0]),
          ans,
          options.map((opt) => opt[1]),
          ans_id,
        ]);
      }
    });
  });

  return randomShuffle(questions);
};

export const default_handler = async (
  deck: string,
  max_per_day: number,
  show_all_questions: boolean
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  const session_data = await generate_all_questions(deck);
  if (show_all_questions)
    max_per_day = Math.min(MAXIMUM_QUESTIONS_IN_ONE_GO, session_data.length);
  return session_data.slice(0, max_per_day);
};
