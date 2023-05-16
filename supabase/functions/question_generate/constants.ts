export const OPENAI_PROMPT =
  `Reply only and only in JSON object, not text. Create ten multiple choice questions (and show correct answer) from the following content for UPSC Prelims preparation:

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

The content that you must generate the question from is as follows:
`;

export interface GPTQuestion {
  question: string;
  options: [string, string, string, string];
  answer: number;
}
