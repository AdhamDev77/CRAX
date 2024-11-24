/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { ComponentConfig } from "../../../packages/core";
import MediaUploader from "@/components/MediaUploader";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Globe, Twitter, Facebook, Linkedin } from "lucide-react";

export type SocialPreviewProps = {
  MainText?: string;
  SecondaryText?: string;
  imageUrl?: string;
  link?: string;
  platform?: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'custom';
  userName?: string;
  userHandle?: string;
  userImage?: string;
  connectionInfo?: string;
};

// Function to fetch metadata from a URL
const fetchUrlMetadata = async (url: string) => {
  try {
    const response = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return {
      title: data.title || '',
      description: data.description || '',
      image: data.image || '',
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'twitter':
      return <Twitter className="h-5 w-5" />;
    case 'facebook':
      return <Facebook className="h-5 w-5" />;
    case 'linkedin':
      return <Linkedin className="h-5 w-5" />;
    default:
      return <Globe className="h-5 w-5" />;
  }
};

// Preview components for different platforms
const TwitterPreview = ({ MainText, SecondaryText, imageUrl, link, userName, userHandle, userImage }: SocialPreviewProps) => (
  <Card className="max-w-[700px] bg-white border border-gray-200">
    <CardContent className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          {userImage && <img src={userImage} alt="" className="w-full h-full object-cover" />}
        </div>
        <div>
          <p className="font-bold">{userName || 'Twitter User'}</p>
          <p className="text-gray-500">{userHandle || '@twitteruser'}</p>
        </div>
      </div>
      <p className="mb-3">{MainText}</p>
      {imageUrl && <div className="mb-3 rounded-xl overflow-hidden"><img src={imageUrl} alt="" className="w-full h-64 object-cover" /></div>}
      {link && <a href={link} className="text-blue-500 hover:underline text-sm">{link}</a>}
    </CardContent>
  </Card>
);

const FacebookPreview = ({ MainText, SecondaryText, imageUrl, link, userName, userImage }: SocialPreviewProps) => (
  <Card className="max-w-[700px] bg-white border border-gray-200">
    <CardContent className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          {userImage && <img src={userImage} alt="" className="w-full h-full object-cover" />}
        </div>
        <div>
          <p className="font-bold">{userName || 'Facebook User'}</p>
          <p className="text-gray-500 text-sm">2h · Public</p>
        </div>
      </div>
      <p className="mb-3">{MainText}</p>
      {imageUrl && <div className="mb-3"><img src={imageUrl} alt="" className="w-full h-72 object-cover" /></div>}
      {link && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-50">
            <p className="text-gray-500 text-sm uppercase">{new URL(link).hostname}</p>
            <p className="font-bold">{SecondaryText}</p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const LinkedInPreview = ({ MainText, SecondaryText, imageUrl, link, userName, userImage, connectionInfo }: SocialPreviewProps) => (
  <Card className="max-w-[700px] bg-white border border-gray-200">
    <CardContent className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          {userImage && <img src={userImage} alt="" className="w-full h-full object-cover" />}
        </div>
        <div>
          <p className="font-bold">{userName || 'LinkedIn User'}</p>
          <p className="text-gray-500 text-sm">{connectionInfo || '500+ connections'}</p>
        </div>
      </div>
      <p className="mb-3">{MainText}</p>
      {imageUrl && <div className="mb-3 border rounded-lg overflow-hidden"><img src={imageUrl} alt="" className="w-full h-64 object-cover" /></div>}
      {link && (
        <div className="p-3 bg-white">
          <p className="font-bold">{SecondaryText}</p>
          <p className="text-gray-500 text-sm">{link}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export const SocialPreview: ComponentConfig<SocialPreviewProps> = {
  label: "Social Media Preview",
  fields: {
    platform: {
      type: "custom",
      render: ({ onChange, value }) => (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    userName: { type: "text", label: "User Name" },
    userHandle: { type: "text", label: "User Handle/Tag" },
    connectionInfo: { type: "text", label: "Connection Info (LinkedIn)" },
    MainText: { type: "text", label: "Main Text" },
    SecondaryText: { type: "text", label: "Secondary Text" },
    link: {
      type: "custom",
      render: ({ onChange, value }) => {
        const [isLoading, setIsLoading] = useState(false);

        const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const url = e.target.value;
          onChange(url);
          
          if (url && url.startsWith('http')) {
            setIsLoading(true);
            try {
              const metadata = await fetchUrlMetadata(url);
              if (metadata) {
                onChange(metadata.title); // Update the main text with fetched title
                // Set other fields as needed
              }
            } catch (error) {
              console.error('Error fetching metadata:', error);
            } finally {
              setIsLoading(false);
            }
          }
        };

        return (
          <div className="relative">
            <Input
              type="url"
              placeholder="Enter URL"
              value={value || ''}
              onChange={handleUrlChange}
              className={isLoading ? 'pr-8' : ''}
            />
            {isLoading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
              </div>
            )}
          </div>
        );
      },
    },
    userImage: {
      type: "custom",
      render: ({ onChange, value }) => <MediaUploader initialImage={value} onImageSelect={onChange} />,
    },
    imageUrl: {
      type: "custom",
      render: ({ onChange, value }) => <MediaUploader initialImage={value} onImageSelect={onChange} />,
    },
  },
  render: ({ platform, ...props }) => {
    switch (platform) {
      case 'twitter':
        return <TwitterPreview {...props} />;
      case 'facebook':
        return <FacebookPreview {...props} />;
      case 'linkedin':
        return <LinkedInPreview {...props} />;
      default:
        return null;
    }
  },
};
