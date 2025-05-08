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

const currentTime = new Date("2025-05-09T08:00:00.000Z").toString(); // Set the current time to a specific date and time for testing
// const currentTime = new Date().toISOString(); // Uncomment this line to use the actual current time

/*
 * Overview endpoint will accept a POST request with data, format, and time_zone parameters in the body
 * DATA is a JSON object containing the time-sensitive business data, which should be filtered for only the data with a date   matching today's date, and only the properties that are relevant to the overview
 * FORMAT is a string that specifies the format in which the overview should be returned
 * TIME_ZONE is a string that specifies the timezone in which the overview should be returned
 * The endpoint will return a string that contains the overview of the data in the specified format

  Example request body:
  {
    "data": JSON.stringify({
      "appointments": [
        {
          "scheduled_time": "2025-05-09T18:00:00.000Z"
        },
        {
          "scheduled_time": "2025-05-09T20:00:00.000Z"
        },
        {
          "scheduled_time": "2025-05-09T16:00:00.000Z"
        },
        {
          "scheduled_time": "2025-05-09T22:00:00.000Z"
        }
      ],
    }),
    "format": "You have {number} appointments scheduled for today. The first appointment is at 8:00AM and the second appointment is at 1:00 PM.",
    "time_zone": "Pacific Daylight Time",
  }
*/
app.post("/overview", async (req, res) => {
  const { data, format, time_zone } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1",
      instructions: `You are an office assistant. Given that the current time is ${currentTime} and the timezone is ${time_zone}, give me a overview of all the data that is after the current time in the following format: ${format}. Don't include any other information. Just give me the overview.`,
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
