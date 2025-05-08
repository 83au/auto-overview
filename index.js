const dotenv = require("dotenv");
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

const currentTime = new Date();

/*
  Example request body:
  {
    "data": JSON.stringify({
      "appointments": [
        {
          "date": "2025-05-09",
          "time": "10:00 AM"
        },
        {
          "date": "2025-05-09",
          "time": "2:00 PM"
        },
        {
          "date": "2025-05-09",
          "time": "9:00 AM"
        },
        {
          "date": "2025-05-09",
          "time": "3:00 PM"
        }
      ],
    }),
    "format": "You have 3 appointments schedule for today. The first appointment is at 8:00AM and the second appointment is at 1:00 PM."
  }

 * Overview endpoint will accept a POST request with data and format parameters in the body
 * DATA is a JSON object containing the time-sensitive business data, which should be filtered for only the data with a date   matching today's date, and only the properties that are relevant to the overview
 * FORMAT is a string that specifies the format in which the overview should be returned
*/
app.post("/overview", async (req, res) => {
  const { data, format } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1",
      instructions: `You are an office assistant. Given that the current time is ${currentTime}, I want you to analyze the attached time-sensitive business data, and give me a overview of all the data that is after the current time in the following format: ${format}`,
      input: JSON.stringify(data),
    });
    res.send(response.output_text);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
