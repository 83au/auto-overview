const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

client.responses.create({
    model: "gpt-4.1",
    input: "Write a one-sentence bedtime story about a unicorn.",
}).then(response => {
  console.log(response.output_text);
})


