import {
  Context,
  SessionFlavor,
} from "https://deno.land/x/grammy@v1.11.2/mod.ts";

// deno-lint-ignore no-explicit-any
export type chatDescription = [number, string, any[][], number, number, number];
interface SessionData {
  chatDescription: chatDescription;
}
export type customContext = Context & SessionFlavor<SessionData>;
