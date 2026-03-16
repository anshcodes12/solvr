const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));

const NVIDIA_API_KEY =
  "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";

app.post("/api/analyze", async (req, res) => {
  console.log("Request received:", req.body);

  const { title, description } = req.body;

  const systemPrompt = `You are a tagging assistant for a platform where people submit real-world problems for developers to solve. Given a problem title and description, return ONLY a valid JSON object with these keys:
  - category: one of [Health, Education, Finance, Transport, Housing, Agriculture, Civic, Utilities, Commerce, Jobs, Sustainability, Other]
  - domain: one of [Mobile App, Web App, Hardware/IoT, Data and Analytics, AI/ML, Automation, Other]
  - difficulty: one of [easy, medium, hard]
  - tags: array of 3 to 5 short keyword strings
  - builder_brief: a 3 to 4 sentence paragraph rewriting the problem in developer friendly language
  No markdown, no explanation. JSON only.`;

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Title: ${title}\nDescription: ${description}`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.2,
        }),
      },
    );

    const data = await response.json();
    console.log("NVIDIA response:", JSON.stringify(data));

    const text = data.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleaned));
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
