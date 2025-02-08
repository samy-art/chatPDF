"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200 p-4">
      {/* New Chat Button */}
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {/* Scrollable Chat List */}
      <div className="flex-grow mt-4 overflow-y-auto scrollbar-hide">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="truncate w-full text-sm whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer: Home and Source */}
      <div className="mt-4 flex-shrink-0">
        <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
          <Link
            href="/"
            className="transition-all duration-300 hover:text-white hover:font-semibold hover:brightness-125"
          >
            Home
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 hover:text-white hover:font-semibold hover:brightness-125"
          >
            Source
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
