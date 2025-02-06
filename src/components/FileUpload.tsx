// initialize it from tsrafce
// this generated react-component is a client component-- it will be rendered on a client
"use client";
import uploadToS3WithProgress from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
console.log("uploadToS3WithProgress:", uploadToS3WithProgress); // Debug here

import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { error } from "console";
import toast from "react-hot-toast";
import { useState } from "react"; // Ensure this import is present
import { useRouter } from "next/navigation";

type Props = {};

const FileUpload = (props: Props) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      // mutation fn allows us to hit the backend api
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3WithProgress(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("something went wrong");
          return;
        }
        // mutate(data, {
        //   onSuccess: ({ chat_id }) => {
        //     toast.success("Chat created!");
        //     router.push(`/chat/${chat_id}`);
        //   },

        mutate(data, {
          onSuccess: (data) => {
            // toast.success(data.message);
            console.log(data);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });

        // console.log("data", data);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
