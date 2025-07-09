import fetch from "node-fetch";

export const askAI = async (data: any) => {
  const { prompt } = data;
  console.log("Prompt received. AI is preparing response...");
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_DEEP_SEEK_KEY}`,
          "X-Title": "Signalyze AI",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };

    let res;
    if (!response.ok) {
      res = {
        status: "error",
        statusText: response.statusText,
      };
    } else {
      res = {
        status: "success",
        data,
      };
    }
    return res;
  } catch (err) {
    console.error("OpenRouter API error:", err);
  }
};
