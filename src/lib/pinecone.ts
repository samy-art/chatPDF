import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const getPineconeClient = async () => {
    return new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  };

type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

  export async function loadS3IntoPinecone(filekey: string) {
    // 1. obtain the pdf --> download and read from the pdf-- create s3 func for it--> s3-server.ts
    console.log('downloading s3 into the file system') 
    const file_name = await downloadFromS3(filekey);
    if (!file_name){
        throw new Error('could not download from s3');
    }  
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    return pages;
}