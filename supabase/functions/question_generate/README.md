# Local Developement Guidelines

To test the function locally:

```
supabase start
supabase functions serve question_generate --env-file .env --debug
supabase functions deploy --no-verify-jwt question_generate
```

To invoke the function:

```
curl -i --location --request POST 'http://localhost:55321/functions/v1/' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
  --header 'Content-Type: application/json' \
  --data '{"download_file_url":"https://api.telegram.org/file/bot6041738264:AAGK5S5UWkxULCaqSLc8uFaFyIr8IhMQimI/documents/file_12.pdf", "userId": "1399169678"}'
```
