const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  try {
    const completion = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: userMsg,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "MyChatbot", 
        },
      }
    );

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    res.json({ reply: "Sorry, I couldn't get a response from the AI." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
