# Deno-GPT

This is a Telegram bot that is made with the aim of helping UPSC aspirants in
their preparation.

The bot is made with the help of GrammY and runs on webhooks and serverless fuccntions. All of the content
is hosted on Supabase and we use OpenAI's API's for dynamic content and question
generation from the content uploaded to the bot (currently only by admins).

## Features

### Basic Demo

https://github.com/EshaanAgg/Deno-GPT/assets/96648934/b3b903fa-c8f7-4905-8837-43324c5ec51e

- There are multiple decks (categories) from which you can choose to practice and revise from.
- Upon choosing a deck, multiple choice questions in form of polls would be shown to you.
- You can even choose for random decks to be displayed.

### User Settings and Reports

https://github.com/EshaanAgg/Deno-GPT/assets/96648934/5e0be03c-b4f6-4b1a-b702-923511561f5b

- As the whole point of `Saras` is to revise your mistakes, you can choose custom question modes.
  - `INC Mode`: Shows all the questions you solved incorrectly the previously time.
  - `XY Mode`: Specify the default number of questions you want to practice.
- All the decks in the menu are arranged on the basic of your accuracy in them, and how long it has been since you revised them.
- You can also use the report option to get the overview of your performance in all of the decks.

### Content Generation

https://github.com/EshaanAgg/Deno-GPT/assets/96648934/6e8702cb-1ac8-4409-9f7d-ddffaa4ca613

- Making questions manually is tedious, and you need to keep updating the bot with recent information, thus we allow file uploads which can be used to make questions for the bot automatically with the help of `OpenAI`.
- Currently this feature is only available to admins.
- After the question generation, admins can use the `/verify` command to see the genearated questions and verify them (or discard them).
- Once verified, they would be available as a deck for all the users to practice.

## Aim of the Project

The aim of this project is to make the journey of one of the most diificult exams of this world a bit simpler with the help of personalised revision!

Introduction of AI tools like OpenAI make it possible for students to summarise whole pdfs and text mannuals int the form of questions and practice them directly. Serverless functions provide an effective method to ensure the scalability and the cost-effectiveness of the same.

## Future Scopes

- I aim to make this into a template and make a guide that can be used by anyone to setup their own telegram based revision bot in `under 15 minutes`, so that they can populate it with their own content and allow communities to customise it according to their education needs.
- Add more revision modes and better visualizations for reports so that more insights about the candidates behaviour can be derived!
