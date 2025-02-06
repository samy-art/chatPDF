// import { db } from "@/lib/db";
// import { chats } from "@/lib/db/schema";
// import { loadS3IntoPinecone } from "@/lib/pinecone";
// import { getS3Url } from "@/lib/s3";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server"
// import { auth } from '@clerk/nextjs/server'


export async function POST(req:Request, res: Response) {
    
    
    try {
        // const { userId } = await auth();  // Get userId from Clerk auth

        // if (!userId) {
        //     return NextResponse.json(
        //       { error: "User ID is required" },
        //       { status: 400 }
        //     );
        //   }

        const body = await req.json();
        const { file_key, file_name } = body;
        console.log(file_key, file_name);
        
        const pages = await loadS3IntoPinecone(file_key);
        
        // const chat_id = await db.insert(chats)
        //     .values({
        //         fileKey: file_key,
        //         pdfName: file_name,
        //         pdfUrl: getS3Url(file_key),
        //         userId: userId, // Now we have userId from auth
        //     })
        //     .returning({ insertedId: chats.id });

      // return NextResponse.json({
      //   chat_id: chat_id[0].insertedId,
      //   status: 200,
      // });
      return NextResponse.json({pages});

        }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "internal server error"},
            {status : 500}

        )
    }
}