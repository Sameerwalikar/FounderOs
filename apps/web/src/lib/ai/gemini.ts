import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = "stepfun-ai/step-3.5-flash";

export async function generateContent(prompt: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 4096,
    stream: false,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI");
  return content;
}

/**
 * Streaming version for chat responses.
 */
export async function* generateContentStream(
  prompt: string,
): AsyncGenerator<string> {
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 4096,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}
