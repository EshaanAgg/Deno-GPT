import { customContext } from "../types.ts";
import { ADMIN_USER_IDS } from "../constants.ts";
import supabase from "../supabaseClient.ts";

const API_BASE_URL = "https://v2.convertapi.com/convert/pdf/to/txt";

export const file_upload_handler = async (ctx: customContext) => {
  const file = await ctx.getFile();
  const download_file_url = `https://api.telegram.org/file/bot${Deno.env.get(
    "TELEGRAM_BOT_TOKEN"
  )}/${file.file_path}`;

  const userId = ctx.msg!.chat.id;
  if (!ADMIN_USER_IDS!.includes(userId.toString())) {
    ctx.reply(
      "Hi! You aren't currently authorised to upload files to the bot. Contact the admins if you think this is a mistake!"
    );
    return;
  }

  await ctx.api.sendMessage(
    userId,
    "Thanks for the upload! We will try to parse it to generate all the questions! "
  );

  if (file.file_path!.slice(-4) != ".pdf") {
    ctx.reply(
      "Currently we only support .pdf files for making questions! Please try again with the correct file type."
    );
    return;
  }

  const pdf_to_text_request = new Request(
    `${API_BASE_URL}?Secret=${Deno.env.get(
      "PDF_TO_TEXT_API_KEY"
    )}&StoreFile=true&File=${download_file_url}`,
    {
      method: "POST",
    }
  );

  const pdf_to_text_response = await fetch(pdf_to_text_request);
  const pdf_to_text_json = await pdf_to_text_response.json();

  if (pdf_to_text_json.error) {
    ctx.reply(
      `The content parsing from the uploaded file failed with the following error message: ${pdf_to_text_json.error.message}`
    );
    return;
  }

  const text_url = pdf_to_text_json["Files"][0]["Url"];

  const content_response = await fetch(text_url);
  const content = await content_response.text();

  await ctx.api.sendMessage(
    userId,
    "The content from the uploaded file has been successfully parsed. Generating questions now! "
  );

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
            content: `Reply only and only in JSON object, not text. Create ten multiple choice questions (and show correct answer) from the following content for UPSC Prelims preparation:

                Answer only in json with keys "question", "options" which is a list of four strings, and "answer" which is an index 0-3: 
                { 
                    "questions": [
                        {
                            "question": "Which is the first state to launch a mobile app for COVID-19 vaccination?",
                            "options": [
                                "A. Kerala",
                                "B. Maharashtra",
                                "C. Tamil Nadu",
                                "D. Karnataka"
                            ],
                            "answer": 0
                        },
                        {
                            ...
                        }
                    ]
                }

                ${content}`,
          },
        ],
      }),
    }
  );

  let make_request = true;
  let attempts = 0;
  let gpt_json;

  while (make_request && attempts < 5) {
    attempts += 1;

    const gpt_response = await fetch(chat_gpt_request);
    gpt_json = await gpt_response.json();

    if (gpt_json.error) {
      ctx.api.sendMessage(
        userId,
        "The content creation request failed due to an error from ChatGPT."
      );
      ctx.api.sendMessage(
        userId,
        `Here is the recieved error message: ${gpt_json.error.message}`
      );
      ctx.api.sendMessage(userId, "Retrying....");
      continue;
    }

    make_request = false;
  }

  if (make_request) {
    ctx.reply(
      "We made 5 tries but recieved an error each time. Please try again later by uplaoding the file again!"
    );
    return;
  }

  ctx.api.sendMessage(
    userId,
    "The question generation was successfull! Adding the questions to database now!"
  );

  const question_content = gpt_json.choices[0].message.content;
  let question_json;

  try {
    question_json = JSON.parse(question_content);
  } catch (err) {
    ctx.reply(
      `The parsing of JSON from the ChatGPT response failed with the following message: ${err.message}`
    );
    return;
  }

  const questions = question_json.questions.map((ques) => ({
    question: ques.question,
    A: ques.options[0].slice(3),
    B: ques.options[1].slice(3),
    C: ques.options[2].slice(3),
    D: ques.options[3].slice(3),
    ans: ques.answer,
  }));

  await supabase.from("chatgpt_generated").insert(questions).select();

  ctx.reply(
    "All the questions have been temporarily stored in a table called 'chatgpt_generated' until they can be verified and added to additional decks!"
  );
};
