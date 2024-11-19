/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import axios from "axios";
import { Site } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MediaUploader from "@/components/MediaUploader";

interface SiteSettingsProps {
  selectedSite: Site;
}

export default function SiteSettings({ selectedSite }: SiteSettingsProps) {
  const { toast } = useToast();
  const [name, setName] = useState(selectedSite.name);
  const [path, setPath] = useState(selectedSite.path);
  const [metaTitle, setMetaTitle] = useState(selectedSite.metaTitle);
  const [metaDescription, setMetaDescription] = useState(
    selectedSite.metaDescription
  );
  const [metaIcon, setMetaIcon] = useState(selectedSite.metaIcon);
  const [loading, setLoading] = useState(false);

  const handleSitePatch = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/site/${selectedSite.path}`, {
        name,
        path,
        metaTitle,
        metaDescription,
        metaIcon,
      });
      console.log("Site successfully updated:", response.data);
      toast({
        title: `${name} - Updated Successfully`,
        description: `${new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())}`,
      });
    } catch (error) {
      console.error("Error updating site:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string | null) => {
    if (imageUrl) {
      setMetaIcon(imageUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Edit the details of your selected site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Site Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              placeholder="site-path"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              placeholder="Meta Title"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input
              id="metaDescription"
              placeholder="Meta Description"
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="metaIcon">Meta Icon</Label>
            <div className="flex gap-4 items-center mt-2">
              {metaIcon && (
                <img src={metaIcon} alt="Meta Icon Preview" className="w-32" />
              )}
              <MediaUploader
                withMediaLibrary={false}
                withUnsplash={false}
                onImageSelect={handleImageSelect}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSitePatch} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
