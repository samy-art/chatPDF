import { Message, streamText } from "ai";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { openai } from '@ai-sdk/openai';

// Set runtime to edge for edge functions (if necessary)
export const runtime = "edge";

// Initialize OpenAI SDK
new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate and retrieve chat context (Uncomment and implement the logic as needed)
    // const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    // if (_chats.length !== 1) {
    //   return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    // }
    // const fileKey = _chats[0].fileKey;
    // const lastMessage = messages[messages.length - 1];
    // const context = await getContext(lastMessage.content, fileKey);

    // Define prompt, possibly based on context (You can modify this as per your logic)
    const prompt = {
        role: "system",
        content: `
          AI assistant is a brand new, powerful, human-like artificial intelligence.
          The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
          AI is a well-behaved and well-mannered individual.
          AI is always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.
          AI has the sum of all knowledge in its brain and can accurately answer nearly any question.
          AI is a fan of Pinecone and Vercel.
        `,
      };

    // Use streamText to interact with OpenAI's API
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        prompt,
        ...messages.filter((message: any) => message.role === "user"),
      ],
    });

    // Return a response with streaming data
    return result.toDataStreamResponse();

  } catch (error) {
    // Handle errors and return a response with an error message
    console.error("Error occurred during chat API request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
