import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
// import * as fs from 'fs';


import { Readable } from "stream";


const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

export async function downloadFromS3(file_key: string): Promise<string> {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const command = new GetObjectCommand(params);
    const response = await s3.send(command);

    // Ensure response.Body exists
    if (!response.Body) {
      throw new Error("File not found or empty response from S3");
    }

    // Ensure that response.Body has the required stream capabilities
    const bodyStream = response.Body as unknown as Readable;

    const file_name = `/tmp/saumya${Date.now().toString()}.pdf`;


    const fileStream = fs.createWriteStream(file_name);

    return new Promise((resolve, reject) => {
      bodyStream
        .pipe(fileStream)
        .on("finish", () => resolve(file_name))
        .on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    throw error;
  }
}

// this code's Functionally: Both codes perform the same task of downloading a file from S3 and saving it to the filesystem.
