import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-pink-300 to-blue-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            {/* UserButton handles sign-out */}
            <UserButton />
          </div>
          <div className="flex mt-2">
            {isAuth && <Button>Go to Chats</Button>}
          </div>
          <div className="mt-4">
            <p className="max-w-xl mt-2 text-lg text-darkgrey-600">
              Join millions of students, researchers, and professionals to
              instantly answer questions and understand research with AI.
            </p>

            <div className="w-full mt-4">
              {isAuth ? (
                <h1>fileupload</h1>
              ) : (
                <Link href="/sign-in">
                  <Button>
                    Login to get Started!
                    <LogIn className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-6">
              <Image
                src="/image2.jpg" // Specify the path to your image
                alt="Descriptive Text"
                width={500} // You can adjust the width
                height={300} // You can adjust the height
                className="rounded-lg" // Optional: add rounded corners for the image
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
