"use client";
import React from "react";
import { Input } from "./ui/input";
import { Message, useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div
        className="flex-none p-4 bg-gradient-to-r from-blue-200 to-purple-300 
                      shadow-md flex items-center justify-center 
                      rounded-xl border"
      >
        <h3 className="text-2xl font-bold text-black tracking-wide">Chat</h3>
      </div>

      {/* Message list */}
      <div
        id="message-container"
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {/* Loader */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="loader" />
          </div>
        )}
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex-none px-2 py-4 bg-white">
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full max-w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChatComponent;
