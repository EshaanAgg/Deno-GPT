// supabase functions serve question_generate --env-file .env --debug

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GPTQuestion, OPENAI_PROMPT } from "./constants.ts";

const supabaseKey = Deno.env.get("DATABASE_KEY");
const ADMIN_USER_IDS = Deno.env.get("ADMIN_USER_IDS");

const supabaseUrl = "https://gomhtyyltrqyoflqrgvy.supabase.co";
const API_BASE_URL = "https://v2.convertapi.com/convert/pdf/to/txt";

const DENO_DEPLOYED_LINK = "https://saras-gpt.deno.dev/";
const supabase = createClient(supabaseUrl, supabaseKey!);

const sendError = (message: string, userId: string) => {
  fetch(DENO_DEPLOYED_LINK, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Supabase",
      error: { message },
      userId,
    }),
  });

  return new Response();
};

const sendSuccess = (message: string, userId: string) => {
  fetch(DENO_DEPLOYED_LINK, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Supabase",
      data: { message },
      userId,
    }),
  });

  return new Response();
};

serve(async (req) => {
  const { download_file_url, userId } = await req.json();

  // Initial authentication of the user
  if (!ADMIN_USER_IDS!.includes(userId.toString())) {
    return sendError(
      "Hi! You aren't currently authorised to upload files to the bot. Contact the admins if you think this is a mistake!",
      userId,
    );
  }

  // Check for supported file types
  if (download_file_url!.slice(-4) != ".pdf") {
    return sendError(
      "Currently we only support .pdf files for making questions! Please try again with the correct file type.",
      userId,
    );
  }

  // Generate the content from the PDF
  const pdf_to_text_request = new Request(
    `${API_BASE_URL}?Secret=${
      Deno.env.get(
        "PDF_TO_TEXT_API_KEY",
      )
    }&StoreFile=true&File=${download_file_url}`,
    {
      method: "POST",
    },
  );

  const pdf_to_text_response = await fetch(pdf_to_text_request);
  const pdf_to_text_json = await pdf_to_text_response.json();

  if (!pdf_to_text_json.ConversionCost) {
    return sendError(
      `The content parsing from the uploaded file failed with the following error message: ${pdf_to_text_json.error.message}`,
      userId,
    );
  }

  const text_url = pdf_to_text_json["Files"][0]["Url"];
  const content_response = await fetch(text_url);
  const content = await content_response.text();

  // Split the content into multiple chunks of 3000 characters
  const content_chunks = [];
  for (let i = 0, charsLength = content.length; i < charsLength; i += 3000) {
    content_chunks.push(content.substring(i, i + 3000));
  }

  for (let i = 0; i < content_chunks.length; i++) {
    // Make API call to Supabase for each of the content chunks
    const content = content_chunks[i];
    const chat_gpt_request = new Request(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          "OpenAI-Organization": "org-CG6c1ogVQGDmNhYh4x1MMZ8o",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `${OPENAI_PROMPT} ${content.toString().trim()}`,
            },
          ],
        }),
      },
    );

    const gpt_response = await fetch(chat_gpt_request);
    const gpt_json = await gpt_response.json();

    if (gpt_json.error) {
      return sendError(
        `The content creation request failed due to an error from ChatGPT. Here is the recieved error message: ${gpt_json.error.message}`,
        userId,
      );
    }

    const question_content = gpt_json.choices[0].message.content;

    let question_json;

    try {
      question_json = JSON.parse(question_content);
    } catch (_err) {
      return sendError(
        `The parsing of JSON from the ChatGPT response failed with the following message: ${question_content}`,
        userId,
      );
    }

    // Generate questions and save them to the Supabase table
    const questions = question_json.questions.map((ques: GPTQuestion) => ({
      question: ques.question,
      A: ques.options[0].slice(3),
      B: ques.options[1].slice(3),
      C: ques.options[2].slice(3),
      D: ques.options[3].slice(3),
      ans: ques.answer,
    }));

    await supabase.from("chatgpt_generated").insert(questions).select();
  }

  return sendSuccess(
    "All the questions have been temporarily stored in a table called 'chatgpt_generated' until they can be verified and added to additional decks!",
    userId,
  );
});
