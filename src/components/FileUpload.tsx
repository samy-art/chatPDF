"use client";
import uploadToS3WithProgress from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {};

const FileUpload = (props: Props) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file_key, file_name }: { file_key: string; file_name: string }) => {
      const response = await axios.post("/api/create-chat", { file_key, file_name });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3WithProgress(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    
      <div className=" mt-1 text-center max-w-lg px-2 py-1  bg-white rounded-2xl shadow-lg">
        <div
          {...getRootProps({
            className:
              " border-dashed border-2  border-gray-400 rounded-2xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col text-gray-600",
          })}
        >
          <input {...getInputProps()} />
          {uploading || isPending ? (
            <>
              <Loader2 className="h-2 w-10 text-blue-600 animate-spin" />
              <p className="mt-4 text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <Inbox className="w-12 h-10 text-blue-900" />
              <p className="mt-4 text-sm">Drop PDF Here</p>
            </>
          )}
        </div>
      </div>

  );
};

export default FileUpload;
