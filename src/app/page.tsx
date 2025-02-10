import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export default async function ChatPage() {
  const { userId } = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="relative w-screen min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://thumbs.dreamstime.com/b/ai-chatbot-concept-glowing-digital-humanoid-robot-figure-dark-blue-background-artificial-intelligence-virtual-assistant-354640613.jpg')] bg-cover bg-center bg-no-repeat"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-blue-100 opacity-80"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-black drop-shadow-lg">
              Chat with any PDF
            </h1>
            <UserButton />
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-4">
            <p className="max-w-xl text-lg text-white drop-shadow-lg mt-4">
              Join millions of students, researchers, and professionals to
              instantly answer questions and understand research with AI.
            </p>

            {/* File Upload or Login Button */}
            <div className="w-full mt-4">
              {isAuth ? (
                <FileUpload />
              ) : (
                <Link href="/sign-in">
                  <center>
                    <Button className="flex items-center px-6 py-4 text-lg shadow-md">
                      Login to get Started!
                      <LogIn className="w-5 h-5 ml-4" />
                    </Button>
                  </center>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
