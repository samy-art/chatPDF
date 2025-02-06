import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

async function uploadToS3WithProgress(file: File) {
    try {
        const s3 = new S3Client({
            region: "ap-southeast-2",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
            },
        });

        const file_key = `uploads/${Date.now().toString()}_${file.name.replace(/\s/g, '-')}`;

        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                Key: file_key,
                Body: file,
                ContentType: file.type,
            },
        });

        upload.on("httpUploadProgress", (progress) => {             // as file is uploaded this function httpUploadProgress will be called
            if (progress.loaded !== undefined && progress.total !== undefined) {          // then you are able to moniter the progress and will be able to create a progress bar
                const percentage = ((progress.loaded / progress.total) * 100).toFixed(2);
                console.log(`Uploading: ${percentage}%`);
            } else {
                console.log("Uploading... progress details unavailable");
            }
        });

        const response = await upload.done();
        console.log("Successfully uploaded to S3:", response);

        return { 
            success: true, 
            file_key: file_key, 
            file_name: file.name 
        };

    } catch (error) {
        console.error("Failed to upload to S3:", error);
        throw error;
    }
}



export function getS3Url(file_key: string): string {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${file_key}`;
  }
  
  // this above function takes in file_key and returns us with publicly accesible s3 url so that we can embed our pdf into chat screen later

export default uploadToS3WithProgress;  
  