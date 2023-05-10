import { toTitleCase } from "./helper.ts";

export const decks: { [key: string]: [string, string, string][] } = {
  amendments: [
    [
      "When was the [MASK] Amendment made to the Indian Constitution?",
      "ordinal",
      "year",
    ],
    ["What was the [MASK] Amendment about?", "ordinal", "description"],
    ["Which Amendment brought about [MASK]", "description", "ordinal"],
  ],
  indices: [
    ["Who releases the [MASK]?", "index", "organization"],
    ["What is India's Ranking in the most recent [MASK]?", "index", "ranking"],
  ],
  reports: [["Who releases the [MASK]?", "report", "organization"]],
  battles: [
    ["Describe the [MASK]", "BattleName", "Description"],
    ["When was the [MASK] fought?", "BattleName", "Year"],
    ["Which battle was fought in [MASK]", "Year", "BattleName"],
    ["Which battle was fought in [MASK]", "Year", "Description"],
  ],
  revolts: [
    ["Who led the [MASK]?", "name", "leaders"],
    ["[MASK] led which revolt?", "leaders", "name"],
  ],
  newspapers: [["Who founded [MASK]?", "newspaper", "founder"]],
  fundamental_rights: [
    [
      "Which Article of the Indian Constitution is about [MASK]?",
      "description",
      "number",
    ],
    [
      "Article [MASK] of the Indian Constitution is about:",
      "number",
      "description",
    ],
  ],
  Chat_GPT: [],
};

export const allDecks = [
  "amendments",
  "indices",
  "reports",
  "battles",
  "revolts",
  "newspapers",
  "fundamental_rights",
  "Chat_GPT",
];
export const allDecksString = allDecks.map((deck) => toTitleCase(deck));

export const N_OPTIONS = 4;
export const cmd = "s";
export const MAX_PER_DAY = 5;
export const BOT_NAME = "Saras-ChatGPT";

export const STICKERS = [
  "CAACAgIAAxkBAAEGCA9jQgc0jfr9f7nwycCvjoE4WlNzngACcgUAAj-VzAoR4VZdHmW_cCoE",
  "CAACAgIAAxkBAAEGCBBjQgc0X9q_lmBoqBRgAbb4XTgQUgACdwUAAj-VzApljNMsSkHZTioE",
  "CAACAgIAAxkBAAEGCBFjQgc0dn7tZKpU0cNWvXuKRQd_3QACcwUAAj-VzAo3ePzsWWk9MyoE",
  "CAACAgIAAxkBAAEGCBJjQgc0_CdK1lpB1oyXglpArQLjjwACZAUAAj-VzAoEyzewVHTnAAEqBA",
  "CAACAgIAAxkBAAEGCBNjQgc0-01zxhL2YGR0nkNcE1hLWAACXgUAAj-VzAqq1ncTLO-MOSoE",
  "CAACAgIAAxkBAAEGCBRjQgc008V2PwYCzjG_kEfUc_3biQACfRMAAqN3qEvCWDsDiG_N4CoE",
  "CAACAgIAAxkBAAEGCDtjQgc0h56DFKp17etepAa1MiB6fQACHQADwDZPE17YptxBPd5IKgQ",
  "CAACAgIAAxkBAAEGCDpjQgc0-AWhlDElHUrzjmCG7baU3gACFQADwDZPE81WpjthnmTnKgQ",
  "CAACAgIAAxkBAAEGCDljQgc09jzb0UldoR_-e4reBQNNKgAC5gUAAj-VzAoNpAABeLxMTcoqBA",
  "CAACAgIAAxkBAAEGCDhjQgc0S7YT3Qn4SL_l8mjBY14pXgAC9QUAAj-VzApSsgntdtBb2ioE",
  "CAACAgIAAxkBAAEGCDdjQgc0CE2JSDRMnCaa3N-dvOhy5wACpQAD9wLID-xfZCDwOI5LKgQ",
  "CAACAgIAAxkBAAEGCDZjQgc0osVuNpCJ-clS7nXosgFrZAACoAAD9wLID8NHHQGgm8AaKgQ",
  "CAACAgIAAxkBAAEGCDVjQgc0_htjRw0dXyedF1d6EYPWvQACLQEAAjDUnREQhgS5L57E0SoE",
  "CAACAgIAAxkBAAEGCDRjQgc05yv7dglGFd3da5Br3_hS1AACIQEAAjDUnRHOsHsspk-aqioE",
  "CAACAgIAAxkBAAEGCDNjQgc0I487lbh8xzGly9Rm4TLHBgACJAEAAjDUnRGjRHcouiC8HioE",
  "CAACAgIAAxkBAAEGCDJjQgc0oCyMYQGsXAqQa2NPHDUcEQACeQADRA3PFy9S9Qcf7wcLKgQ",
  "CAACAgIAAxkBAAEGCDFjQgc0R2dQLCoI0RstbcUFi39w6QACRQwAAnqdmEo2Geh166RTLCoE",
  "CAACAgIAAxkBAAEGCDBjQgc0pYwUUXWVAattAi68_7fy4AACFAADrWW8FHrcaPPdRxvpKgQ",
  "CAACAgIAAxkBAAEGCC9jQgc0ka5wiRjE99F1gSbos8pp1QACGAADrWW8FI3m6pccnyfSKgQ",
  "CAACAgIAAxkBAAEGCC5jQgc0SMZY0Kv6T0ToyHg6cJBbgAAChAADpsrIDDCcD7Wym5gUKgQ",
  "CAACAgIAAxkBAAEGCC1jQgc01ZAPCpHSOf80qGbej4eN5AACagADpsrIDGtK7sZiKAktKgQ",
  "CAACAgIAAxkBAAEGCC1jQgc01ZAPCpHSOf80qGbej4eN5AACagADpsrIDGtK7sZiKAktKgQ",
  "CAACAgIAAxkBAAEGCCxjQgc0ffPwtFpNqvfaaQvC3qrwPgACcAsAAoZ4aEpixBHzG__SuSoE",
  "CAACAgIAAxkBAAEGCCtjQgc0W7MSZVtUM1sAAfTBnwxRmdkAAl4SAALsmSlJfO_ZpUf3ZDsqBA",
  "CAACAgIAAxkBAAEGCCpjQgc0IMBA8H9fzd69xrDZSqWdGAACchIAAkblqUjyTBtFPtcDUSoE",
  "CAACAgIAAxkBAAEGCCljQgc0jZtLG765mKCBE9xsCl0UlAAC_w4AAs3wKEj82j4UNdEddioE",
  "CAACAgIAAxkBAAEGCChjQgc0t7-ICzDivb3633kbkpSNbwACkw4AAnpjWUp9YoHH83C_mCoE",
  "CAACAgIAAxkBAAEGCCdjQgc0Nv3sAAHCiooM0DeNiLouU9MAAqURAAJiHMFKNy8r5Ksh0usqBA",
  "CAACAgIAAxkBAAEGCCZjQgc03kILE8GhugNZB392duKMEAACNBEAAoItWUqvOls5-JhwoioE",
  "CAACAgIAAxkBAAEGCCVjQgc0YrWMwi0xmxKgT0BKDUBFtQACnBEAAtztWUp85Z0jBiCdeSoE",
  "CAACAgIAAxkBAAEGCCRjQgc0MQ0UxmjDGtfOZM0cIg6alAAC-hMAAqfyMUo3RixLA7vktyoE",
  "CAACAgIAAxkBAAEGCCNjQgc0TOxtnMoqQ00I5_eEn-wktAACExIAAq3mUUhZ4G5Cm78l2CoE",
  "CAACAgIAAxkBAAEGCCJjQgc0_CpBqzHBeTipq12mbzwZhgACHg4AAviGWUsCRJ26Owuh0SoE",
  "CAACAgIAAxkBAAEGCCFjQgc0LDlVcw9rQW2XTWKEuXVaIgACZhAAAjrKAAFLoph7HvTj3dAqBA",
  "CAACAgIAAxkBAAEGCCBjQgc0fK4EwXkiaH-GLH55OuzOswACVBEAApKnEEi3tFg_Su4TTSoE",
  "CAACAgIAAxkBAAEGCB9jQgc0soLu7CHGDUJ2FFTPkHXm_wAC3BEAAtfmiUprmtcmqgFCFCoE",
  "CAACAgIAAxkBAAEGCB5jQgc0ei7Y-ZkHgDfbY_7bjp3tmQACiREAAkdjaUsuMdFj6ytp3ioE",
  "CAACAgIAAxkBAAEGCB1jQgc0gzMctOdX4QHj9eN_n3BNWQACYhQAAoxzQUmp5bwL8cqPBioE",
  "CAACAgIAAxkBAAEGCBxjQgc077WCwr6Jtd89kZmCMOJS1AACkRIAAvzw4UodOfjG8l2MsyoE",
  "CAACAgIAAxkBAAEGCBtjQgc0OJ14kuG7OQELxfE6vRq_MwAChRQAArcb0UkhsZsInF6NSCoE",
  "CAACAgIAAxkBAAEGCBpjQgc0O6NrQ04ez4HdXp3deUlyKwACORMAAmcRUUnFwywHLUm4JCoE",
  "CAACAgIAAxkBAAEGCBljQgc0EsmIWT44r-yewo-atXHU0QACSgIAAladvQrJasZoYBh68CoE",
  "CAACAgIAAxkBAAEGCBhjQgc0DSUxtBqwpYBLFo9mz4y4kAAC_gADVp29CtoEYTAu-df_KgQ",
  "CAACAgIAAxkBAAEGCBdjQgc04R0P9nQ2BBdJgiwue5aSVAACgxgAAstUsErrON6r0Zh6GSoE",
  "CAACAgIAAxkBAAEGCBZjQgc0mHB56u54ZKPVLRZfiZJZigACNhYAAlxA2EvbRm7S3ZV6DSoE",
  "CAACAgIAAxkBAAEGCBVjQgc01RY3w--cIGgzpP_Z7npKbwACcRgAAmAswEhDEnqaks1kICoE",
  "CAACAgIAAxkBAAEGCBRjQgc008V2PwYCzjG_kEfUc_3biQACfRMAAqN3qEvCWDsDiG_N4CoE",
  "CAACAgIAAxkBAAEGCBNjQgc0-01zxhL2YGR0nkNcE1hLWAACXgUAAj-VzAqq1ncTLO-MOSoE",
  "CAACAgIAAxkBAAEGCBJjQgc0_CdK1lpB1oyXglpArQLjjwACZAUAAj-VzAoEyzewVHTnAAEqBA",
  "CAACAgIAAxkBAAEGCBFjQgc0dn7tZKpU0cNWvXuKRQd_3QACcwUAAj-VzAo3ePzsWWk9MyoE",
  "CAACAgIAAxkBAAEGCBBjQgc0X9q_lmBoqBRgAbb4XTgQUgACdwUAAj-VzApljNMsSkHZTioE",
  "CAACAgIAAxkBAAEGCA9jQgc0jfr9f7nwycCvjoE4WlNzngACcgUAAj-VzAoR4VZdHmW_cCoE",
  "CAACAgIAAxkBAAEGCAtjQgXjEhaapVKc_CzM0TG6Uy_cSAACEwADwDZPE6qzh_d_OMqlKgQ",
];

export const texts = {
  explanation: "Glad you revised it 😇",
  archive: "Remove Quote 👎",
  pardon: "Pardon Me?",
  remember: "Did you remember this?",
  welcome: `Welcome to Saras. Send /${cmd} to begin learning a new deck!`,
  welcome_back: `Welcome back! Send /${cmd} to resume learning a new deck!`,
  archive_res: "Got rid of that for you 🔥",
  "": "",
  complete: `Deck revision complete! Send /${cmd} to start another!`,
  help: `Saras is your daily self-revision guide for UPSC decks. Just select /${cmd} from the options to the left of your keypad or type and send /${cmd} in chat, to start!\n\n
        Decks on Saras: ${allDecksString}. \n\n
        We will soon add more decks and features. Please share your feedback with us at +1 213 374 6583.`,
};
