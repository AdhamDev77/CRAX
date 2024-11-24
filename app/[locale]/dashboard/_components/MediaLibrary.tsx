"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Site } from "../../types";
import MediaUploader from "@/components/MediaUploader";
import Image from "next/image";

export default function MediaLibrary({ selectedSite }: { selectedSite: Site }) {
  const [images, setImages] = useState<string[]>(selectedSite.mediaLibrary || []);

  useEffect(() => {
    setImages(selectedSite.mediaLibrary || []);
  }, [selectedSite.mediaLibrary]);

  // New function to handle image selection and API posting
  const handleImageSelect = async (image: string | null) => {
    if (image) {
      // Update the local state
      setImages((prevImages) => [...prevImages, image]); // Add selected image to state

      // Post the selected image to your API
      try {
        const response = await axios.put(`/api/site/${selectedSite.path}/media-library`, {
          urls: [image],
        });
        console.log("Image successfully added:", response.data);
      } catch (error) {
        console.error("Error posting image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-black dark:text-white">Media Library</h1>
        <MediaUploader 
          withMediaLibrary={false}
          withUnsplash={true}
          onImageSelect={handleImageSelect}
        />
      </div>

      {images.length > 0 ? (

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Uploaded ${index + 1}`}
            className="w-full h-auto object-cover rounded-md"
          />
        ))}
      </div>
      ):(            <div className="flex flex-col gap-12 w-full h-full items-center my-12">
        <h1 className="uppercase text-4xl font-bold text-stone-800 dark:text-white">Upload your first media item</h1>
        <Image
          src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/8696077d-830a-4b1e-bd86-9df98f89994a/2021/05/25/71c90c5e-7959-4bd8-ba1e-8010b2f40c61/ec3592b0-3f92-4e66-83d8-7407801f7265.gif"
          alt="Form add tutorial"
          width={750}
          height={750}
          className="h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
        />
      </div>)}
    </div>
  );
}
