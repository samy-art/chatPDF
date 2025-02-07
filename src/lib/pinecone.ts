
import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
    Document,
    RecursiveCharacterTextSplitter,
  } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";  
import md5 from "md5";
import { convertToAscii } from "./utils";



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

// Now we need to obtain the PDF, split and segment, vectorize and store it.
// To map these four steps into a function

export async function loadS3IntoPinecone(filekey: string) {
    // 1. obtain the pdf --> download and read from the pdf-- create s3 func for it--> s3-server.ts
    console.log('downloading s3 into the file system') 
    const file_name = await downloadFromS3(filekey);
    if (!file_name){
        throw new Error('could not download from s3');
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // 2. split and segment the pdf 
    const documents = await Promise.all(pages.map(prepareDocument));  // takes the pages and split up even further


    // 3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // 4. upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("chatpdf");
    const namespace = pineconeIndex.namespace(convertToAscii(filekey));

    console.log("inserting vectors into pinecone"); 
    await namespace.upsert(vectors);

    return documents[0];
}

// first we will use the openAI function to actually grt the embeddings of a single string
async function embedDocument(doc: Document){
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);   // we can id the vector within pinecone
    
        return {
          id: hash,
          values: embeddings,
          metadata: {
            text: doc.metadata.text,
            pageNumber: doc.metadata.pageNumber,
          },
        } as PineconeRecord;
      } catch (error) {
        console.log("error embedding document", error);
        throw error;
      }
}

export { embedDocument };



export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));

}

async function prepareDocument(page: PDFPage){     // takes only a singular page
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");

    //split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);

    return docs        // it can split up into mulitple docs or 5-6 para for a single page

}

