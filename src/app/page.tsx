// "use client";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { UserButton, useAuth } from "@clerk/nextjs";

// export default function HomePage() {
//   const router = useRouter();
//   const { userId } = useAuth();
//   const isAuth = !!userId;

//   const navigateToChat = () => {
//     router.push("/chat");
//   };

//   const navigateToDocs = () => {
//     router.push("/editor");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-200 to-teal-100">
//       <div className="absolute top-4 right-4">
//         {isAuth ? (
//           <UserButton />
//         ) : (
//           <Button
//             onClick={() => router.push("/sign-in")}
//             className="px-4 py-2 text-md bg-purple-500 hover:bg-purple-400"
//           >
//             Sign In
//           </Button>
//         )}
//       </div>
//       <h1 className="text-4xl font-bold mb-6">Welcome to Collab Write</h1>
//       <p className="text-lg mb-6">
//         Your AI-powered PDF assistant and document editor await!
//       </p>
//       <div className="flex space-x-4">
//         <Button
//           onClick={navigateToChat}
//           className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-400"
//         >
//           ChatPDF
//         </Button>
//         <Button
//           onClick={navigateToDocs}
//           className="px-6 py-3 text-lg bg-green-500 hover:bg-green-400"
//         >
//           Docs Editor
//         </Button>
//       </div>
//     </div>
//   );
// }

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
    <div className="w-screen min-h-screen bg-gradient-to-r from-pink-300 to-blue-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
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
            <p className="max-w-xl mt-2 text-lg text-darkgrey-600">
              Join millions of students, researchers, and professionals to
              instantly answer questions and understand research with AI.
            </p>

            <div className="w-full mt-4">
              {isAuth ? (
                <FileUpload />
              ) : (
                <Link href="/sign-in">
                  <Button>
                    Login to get Started!
                    <LogIn className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
