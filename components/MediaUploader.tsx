import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Camera, X, Search, Loader2 } from "lucide-react";
import { createApi } from "unsplash-js";
import { cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { UploadDropzone } from "@uploadthing/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Types
interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string | null;
}

interface UploadResponse {
  url: string;
  name: string;
}

interface MediaUploaderProps {
  onImageSelect: (image: string | null) => void;
  withMediaLibrary?: boolean;
  withUnsplash?: boolean;
  initialImage?: string;
}

interface RouteParams {
  sitePath?: string;
}

// Type guard for checking if response is an array of UploadResponse
function isUploadResponseArray(
  response: unknown
): response is UploadResponse[] {
  return (
    Array.isArray(response) &&
    response.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "url" in item &&
        typeof item.url === "string"
    )
  );
}

const unsplash = createApi({
  accessKey: "qtygm95Jsf-EWGjFzdqMyoFH6QCm6aSICTsFjHkaoqI",
});

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onImageSelect,
  withMediaLibrary = false,
  withUnsplash = false,
  initialImage,
}) => {
  const params = useParams() as RouteParams;
  const sitePath = params.sitePath;

  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImage || null
  );
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [unsplashSearch, setUnsplashSearch] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMediaLibrary = async () => {
      if (!withMediaLibrary || !sitePath) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<string[]>(
          `/api/site/${sitePath}/media-library`
        );
        if (isMounted) {
          setMediaLibrary(response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          const error = err as Error | AxiosError;
          setError(`Failed to load media library: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMediaLibrary();
    return () => {
      isMounted = false;
    };
  }, [sitePath, withMediaLibrary]);

  useEffect(() => {
    let isMounted = true;

    const fetchDefaultImages = async () => {
      setIsLoading(true);
      setError(null);
      if (withUnsplash) {
        try {
          const response = await unsplash.photos.getRandom({ count: 12 });
          if (isMounted && response.response) {
            const images = Array.isArray(response.response)
              ? response.response
              : [response.response];
            setUnsplashImages(images as UnsplashImage[]);
          }
        } catch (err) {
          if (isMounted) {
            const error = err as Error;
            setError(`Failed to load Unsplash images: ${error.message}`);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };
    if (withUnsplash) {
      fetchDefaultImages();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageSelection = (image: string | null): void => {
    setSelectedImage(image);
    onImageSelect(image);
    setDialogOpen(false);
  };

  const handleUnsplashSearch = async (): Promise<void> => {
    if (!unsplashSearch.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await unsplash.search.getPhotos({
        query: unsplashSearch,
        page: 1,
        perPage: 50,
      });

      if (response.response?.results) {
        setUnsplashImages(response.response.results);
      }
    } catch (err) {
      const error = err as Error;
      setError(`Failed to search Unsplash images: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomUrlSubmit = async (): Promise<void> => {
    if (!customUrl.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl);
      const contentType = response.headers.get("content-type");

      if (!response.ok || !contentType?.includes("image")) {
        throw new Error("Invalid image URL or content type");
      }

      handleImageSelection(customUrl);
      setCustomUrl("");
    } catch (err) {
      const error = err as Error;
      setError(`Invalid image URL: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      void handleCustomUrlSubmit();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          aria-label="Open image uploader"
          type="button"
        >
          <Camera className="h-4 w-4" />
          {selectedImage ? "Change Image" : "Upload Image"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose an Image</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          defaultValue={
            !withMediaLibrary
              ? !withUnsplash
                ? "upload"
                : "unsplash"
              : "library"
          }
          className="w-full"
        >
          <TabsList
            className={cn("grid w-full", {
              "grid-cols-3": withMediaLibrary,
              "grid-cols-2": !withMediaLibrary && withUnsplash,
              "grid-cols-1": !withMediaLibrary && !withUnsplash,
            })}
          >
            {withMediaLibrary && (
              <TabsTrigger value="library">Media Library</TabsTrigger>
            )}
            {withUnsplash && (
              <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            )}
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          {/* Media Library Tab */}
          {withMediaLibrary && (
            <TabsContent value="library" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-3 flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : mediaLibrary.length > 0 ? (
                  mediaLibrary.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleImageSelection(imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Media library image ${index + 1}`}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No images in media library
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Unsplash Tab */}
          {withUnsplash && (
            <TabsContent value="unsplash" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search Unsplash..."
                  value={unsplashSearch}
                  onChange={(e) => setUnsplashSearch(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && void handleUnsplashSearch()
                  }
                />
                <Button
                  onClick={() => void handleUnsplashSearch()}
                  disabled={isLoading}
                  type="button"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-3 flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  unsplashImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleImageSelection(image.urls.regular)}
                    >
                      <img
                        src={image.urls.small}
                        alt={image.alt_description || "Unsplash image"}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Upload from Device</h3>
                <UploadDropzone<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (isUploadResponseArray(res) && res.length > 0) {
                      const urls = res.map((item) => item.url);
                      if (withMediaLibrary && sitePath) {
                        axios
                          .put(`/api/site/${sitePath}/media-library`, { urls })
                          .then(() => {
                            setMediaLibrary((prev) => [...prev, ...urls]);
                            handleImageSelection(urls[0]);
                          })
                          .catch((err: Error) => {
                            setError(`Failed to upload image: ${err.message}`);
                          });
                      } else {
                        handleImageSelection(urls[0]);
                      }
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setError(`Upload failed: ${error.message}`);
                  }}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Enter Image URL</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    onClick={() => void handleCustomUrlSubmit()}
                    disabled={isLoading}
                    type="button"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {selectedImage && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Selected Image</h3>
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected image preview"
                className="w-full h-full object-cover"
              />
              <Button
                onClick={() => handleImageSelection(null)}
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                aria-label="Remove selected image"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploader;
