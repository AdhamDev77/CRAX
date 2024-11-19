/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useEffect, useState } from "react";

const ScreenshotComponent = ({ url }: { url: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        if (url) {
          const response = await axios.get(
            `https://api.screenshotone.com/take?access_key=mrc7BpWR8nJXIw&url=${url}&full_page=false&viewport_width=1920&viewport_height=1080&device_scale_factor=1&format=jpg&image_quality=80&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&delay=0&timeout=60`,
            {
              responseType: "blob", // Ensures the response is in binary format
            }
          );

          // Create a URL for the blob to display the image
          const imageBlobUrl = URL.createObjectURL(response.data);
          setImageUrl(imageBlobUrl);
        }
      } catch (error) {
        console.error("Error fetching screenshot:", error);
      }
    };

    fetchScreenshot();

    // Clean up the URL object when component unmounts
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [url, imageUrl]);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="Screenshot of Facebook" />
      ) : (
        <p>Loading screenshot...</p>
      )}
    </div>
  );
};

export default ScreenshotComponent;
