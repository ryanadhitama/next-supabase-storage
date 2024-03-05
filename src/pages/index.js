import supabase from "@/config/supabase";
import Head from "next/head";
import { useRef, useState } from "react";
import { nanoid } from "nanoid";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = async () => {
    if (selectedFile) {
      const filename = nanoid();

      const { data, error } = await supabase.storage
        .from("nextsupabase")
        .upload(
          `${filename}.${selectedFile.name.split(".").pop()}`,
          selectedFile
        );

      if (error) {
        console.error("Error uploading file:", error.message);
      } else {
        const { data: file } = await supabase.storage
          .from("nextsupabase")
          .getPublicUrl(data?.path);
        console.log(file);
        setUploaded(file?.publicUrl);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold">Upload File</h1>
        </div>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            setSelectedFile(e?.target?.files?.[0]);
          }}
        />
        <button
          className="mt-5 bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
          type="button"
          onClick={handleUpload}
        >
          Upload File
        </button>
        {uploaded && <img src={uploaded} className="my-5 max-w-[400px]" />}
      </div>
      <Head>
        <title>Upload File</title>
      </Head>
    </>
  );
}
