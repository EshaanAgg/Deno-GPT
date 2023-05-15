// deno-lint-ignore-file

import { randomSample, randomShuffle } from "../helper.ts";
import supabase from "../supabaseClient.ts";
import { decks } from "../constants.ts";

const generate_all_questions = async (deck: string) => {
  const question_templates = decks[deck];
  const { data: question_data } = await supabase.from(deck).select("*");

  const questions: any[] = [];

  question_templates.forEach((template) => {
    question_data!.forEach((ques) => {
      const [question_string, fill_column, ans_column] = template;

      const ans = ques[ans_column];
      // Check if the ans option can be a valid option or not
      if (ans != null && ans.length < 100) {
        const ans_id = ques["id"];

        const options = randomSample(question_data!, 5)
          .filter((ques) => ques["id"] != ans_id)
          .map((ques) => ques[ans_column])
          .filter((opt) => opt != null && opt.length < 100)
          .slice(0, 3);
        options.push(ans);
        randomShuffle(options);

        questions.push({
          question: question_string.replace("[MASK]", ques[fill_column]),
          A: options[0],
          B: options[1],
          C: options[2],
          D: options[3],
          ans: options.indexOf(ans),
          deck,
          confirmed: true,
        });
      }
    });
  });

  return randomShuffle(questions);
};

const main = async (deck: string) => {
  const all_questions = await generate_all_questions(deck);
  await supabase.from("chatgpt").insert(all_questions);
};

// main("amendments");
// main("indices");
// main("reports");
// main("battles");
// main("newspapers");
// main("fundamental_rights");
// main("revolts");
