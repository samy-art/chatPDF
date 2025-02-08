import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch chats from the database
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat Sidebar (fixed height, no scrolling) */}
      <div className="w-72 h-screen flex-shrink-0">
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
      </div>

      {/* pdf viewer --> Main Chat Content (Single Scrollbar) */}
      <div className="flex-grow h-screen P-4 overflow-y-auto bg-gray-800">
        {/* <div className="p-4"> */}
        {/* <p className="text-white">Chat content goes here...</p> */}
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>
      {/* </div> */}
    </div>
  );
};

export default ChatPage;
