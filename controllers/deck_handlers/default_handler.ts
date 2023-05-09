import { randomSample, randomShuffle, randomChoice } from "../../helper.ts";
import supabase from "../../supabaseClient.ts";
import { decks, N_OPTIONS } from "../../constants.ts";

export const default_handler = async (
  deck: string,
  max_per_day: number
  // deno-lint-ignore no-explicit-any
): Promise<any[][]> => {
  let { data } = await supabase.from(deck).select("*");
  if (!data) data = [];

  // deno-lint-ignore prefer-const
  let session = [];
  let attempts = 0;

  while (session.length < max_per_day) {
    attempts += 1;
    const [template, fill_col, ans_col] = randomChoice(decks[deck]);
    let qs = randomSample(data, N_OPTIONS);

    const ans = String(qs[0][ans_col]);
    const fill = qs[0][fill_col];
    const ans_id = qs[0]["id"];
    qs = randomShuffle(qs);

    // deno-lint-ignore prefer-const
    let options: string[] = [];
    // deno-lint-ignore prefer-const
    let option_ids: string[] = [];
    let max_option_length = -1;

    qs.forEach((q) => {
      options.push(String(q[ans_col]));
      option_ids.push(q["id"]);
      max_option_length = Math.max(max_option_length, String(q[ans]).length);
    });

    // deno-lint-ignore prefer-const
    let ans_array: string[] = [];
    session.forEach((s) => ans_array.push(s[2]));

    if (!ans_array.includes(ans) && max_option_length < 95) {
      session.push([
        template.replace("[MASK]", fill),
        options,
        ans,
        option_ids,
        ans_id,
      ]);
    } else {
      console.log(`Skipped this attempt with options = ${options}`);
    }
  }

  return session;
};
