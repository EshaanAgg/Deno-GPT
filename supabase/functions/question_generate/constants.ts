export const OPENAI_PROMPT =
  `Reply only and only as a JSON object, not text. Create 10 multiple choice questions (and show correct answer) from the content given at the end of this message for UPSC Prelims preparation:

Answer only in JSON with keys "question", "options" which is a list of four strings, and "answer" which is an index 0-3. Here is a sample VALID response:
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

Remember! DO NOT send me anything other than valid JSON! This is of utmost importance.

The content that you must generate the questions from is as follows:

`;

export interface GPTQuestion {
  question: string;
  options: [string, string, string, string];
  answer: number;
}
