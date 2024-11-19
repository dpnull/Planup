const axios = require("axios");
require("dotenv").config(); // load environmental variables

// generate a schedule based on user input
const generateSchedule = async (input) => {
  if (!process.env.OPENAI_API_KEY) {
    // make sure the API key is set
    console.error("Missing OPENAI_API_KEY environment variable");
    throw new Error("OPENAI_API_KEY is not defined.");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: input, // passing user's input
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  // handling the API response
  if (
    response.data &&
    response.data.choices &&
    response.data.choices.length > 0
  ) {
    return response.data.choices[0].message.content.trim();
  } else {
    throw new Error("Invalid response structure from OpenAI API.");
  }
};

// function to submit generated schedule
const submitScheduleData = async (data) => {
  const response = await axios.post(
    "http://localhost:3000/gpt3/generate-schedule",
    data,
    {
      headers: {
        // set content type
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.data) {
    throw new Error("Failed to submit schedule data");
  }

  return response.data;
};

module.exports = { generateSchedule, submitScheduleData };
