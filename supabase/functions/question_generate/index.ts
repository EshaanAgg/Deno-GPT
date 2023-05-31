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

const sendMessage = (message: string, userId: string) => {
  fetch(DENO_DEPLOYED_LINK, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Supabase",
      message,
      userId,
    }),
  });
};

const makeChatGPTAPIRequest = async (
  i: number,
  content: string,
  userId: string,
  deckName: string,
) => {
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
    sendMessage(
      `Error: The content creation of Request Number ${
        i + 1
      } failed due to an error from ChatGPT. Here is the recieved error message: ${gpt_json.error.message}`,
      userId,
    );
    return -1;
  }

  const question_content = gpt_json.choices[0].message.content;

  let question_json;

  try {
    question_json = JSON.parse(question_content);
  } catch (_err) {
    sendMessage(
      `Error: The parsing of JSON from the ChatGPT response failed for Request ${
        i + 1
      }. The ChatGPT response was: \n\n${
        question_content.slice(0, Math.min(500, question_content.length))
      }.... \n\nwhich couldn't be paresed as JSON.`,
      userId,
    );
    return -1;
  }

  // Generate questions and save them to the Supabase table
  const questions = question_json.questions.map((ques: GPTQuestion) => ({
    question: ques.question,
    A: ques.options[0].slice(3),
    B: ques.options[1].slice(3),
    C: ques.options[2].slice(3),
    D: ques.options[3].slice(3),
    ans: ques.answer,
    deckName,
  }));

  await supabase.from("chatgpt_generated").insert(questions).select();

  sendMessage(
    `${questions.length} questions were generated as a part of Request ${
      i + 1
    } and were successfully added to the database. `,
    userId,
  );

  return 1;
};

serve(async (req) => {
  const { download_file_url, userId, deckName } = await req.json();

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

  sendMessage(
    `The content has been parsed successfully from the pdf! The bot is now working on generating questions from the same. You can view the generated content by visiting ${text_url}`,
    userId,
  );

  // Split the content into multiple chunks of 3000 characters
  let content_chunks = [];
  for (let i = 0, charsLength = content.length; i < charsLength; i += 3000) {
    content_chunks.push(content.substring(i, i + 3000));
  }

  // Filter content chunks so that only prompts with enough context are used.
  content_chunks = content_chunks.filter((chunk) => chunk.length > 300);

  sendMessage(
    `The pdf has been split into ${content_chunks.length} sub pages! Making calls for each of them now.`,
    userId,
  );

  const allRequests = [];

  for (let i = 0; i < content_chunks.length; i++) {
    // Make API call to Supabase for each of the content chunks
    const content = content_chunks[i];
    allRequests.push(makeChatGPTAPIRequest(i, content, userId, deckName));
  }

  let successful_request_count = 0, failed_requests_count = 0;

  const apiCallResults = await Promise.all(allRequests);
  apiCallResults.forEach((req) => {
    if (req > 0) successful_request_count++;
    else failed_requests_count++;
  });

  sendMessage(
    `File upload operation complete. In all, ${
      successful_request_count + failed_requests_count
    } requests were made to ChatGPT, out of which ${successful_request_count} were successful and ${failed_requests_count} failed. `,
    userId,
  );

  return new Response();
});
