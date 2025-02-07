import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string): Promise<number[] | null> {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    const result = await response.json();
    console.log("OpenAI API Response:", result); // Log the full response for debugging

    // Check if the response contains a valid embedding
    if (!result || !result.data || !result.data[0]?.embedding) {
      console.warn("Invalid embedding response from OpenAI", result);
      return null; // Return null instead of breaking the code
    }

    return result.data[0].embedding as number[];
  } catch (error) {
    console.error("Error calling OpenAI embeddings API:", error);
    return null; // Return null to handle errors gracefully
  }
}
