import {
  Context,
  SessionFlavor,
} from "https://deno.land/x/grammy@v1.11.2/mod.ts";

export type PollInfoType = {
  pollId: string;
  questionId: string;
  correctAnsIndex: number;
};

// deno-lint-ignore no-explicit-any
export type chatDescription = [number, string, any[][], number, number, string];
interface SessionData {
  chatDescription: chatDescription;
  /*
   * Set to 1-100 to indicate the question count
   * Set to 0 to indicate all questions
   * Set to -1 to indicate all the questions which were previously incorrect
   */
  questionPreference: number;
  pollInfo: PollInfoType[];
  uploadedFileLink: string | null;
}
export type customContext = Context & SessionFlavor<SessionData>;
