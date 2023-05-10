const content = `Coronavirus disease 2019 (COVID-19) is a contagious disease caused by a virus, the severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). The first known case was identified in Wuhan, China, in December 2019.[5] The disease quickly spread worldwide, resulting in the COVID-19 pandemic.

The symptoms of COVID‑19 are variable but often include fever,[6] cough, headache,[7] fatigue, breathing difficulties, loss of smell, and loss of taste.[8][9][10] Symptoms may begin one to fourteen days after exposure to the virus. At least a third of people who are infected do not develop noticeable symptoms.[11] Of those who develop symptoms noticeable enough to be classified as patients, most (81%) develop mild to moderate symptoms (up to mild pneumonia), while 14% develop severe symptoms (dyspnea, hypoxia, or more than 50% lung involvement on imaging), and 5% develop critical symptoms (respiratory failure, shock, or multiorgan dysfunction).[12] Older people are at a higher risk of developing severe symptoms. Some people continue to experience a range of effects (long COVID) for months after recovery, and damage to organs has been observed.[13] Multi-year studies are underway to further investigate the long-term effects of the disease.[13]

COVID‑19 transmits when infectious particles are breathed in or come into contact with the eyes, nose, or mouth. The risk is highest when people are in close proximity, but small airborne particles containing the virus can remain suspended in the air and travel over longer distances, particularly indoors. Transmission can also occur when people touch their eyes, nose or mouth after touching surfaces or objects that have been contaminated by the virus. People remain contagious for up to 20 days and can spread the virus even if they do not develop symptoms.[14]

`;

const chat_gpt_request = new Request(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `BEARER ${Deno.env.get("OPENAI_API_KEY")}`,
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcHAiLCJzdWIiOiIxMjM4NzciLCJhdWQiOiJXRUIiLCJpYXQiOjE2ODI3MTUxMTgsImV4cCI6MTY4MzMxOTkxOH0.KcU6QQh7yt_kHVJKnzfuCylns6TJg01R9c1fy-0oNoY`,
      "OpenAI-Organization": "org-CG6c1ogVQGDmNhYh4x1MMZ8o",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Reply only and only in JSON object, not text. Create ten multiple choice questions (and show correct answer) from the following current affairs for UPSC Prelims preparation:

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

const gpt_response = await fetch(chat_gpt_request);
const gpt_json = await gpt_response.json();
console.log(gpt_json);
console.log(gpt_json.choices);
console.log(gpt_json.choices[0].message.content);

// const { data } = await supabase
//   .from("chatgpt")
//   .insert([{ question, A, B, C, D, ans }]).select();
