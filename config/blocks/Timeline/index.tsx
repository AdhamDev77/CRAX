"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ComponentConfig } from "@measured/puck";
import MediaUploader from "@/components/MediaUploader";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: {title: string}[];
  period: string;
  description?: string;
}

export type TimelineProps = {
  title: string;
  subtitle: string;
  colorMode: "light" | "dark";
  resumeData: ResumeCardProps[];
};

export const Timeline: ComponentConfig<TimelineProps> = {
  label: "Resume Section",
  fields: {
    title: {
      section: "content",
      type: "text",
      label: "Title",
    },
    subtitle: {
      section: "content",
      type: "text",
      label: "Subtitle",
    },
    colorMode: {
      section: "content",
      type: "radio",
      label: "Color Mode",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
    resumeData: {
      section: "content",
      type: "array",
      label: "Resume Items",
      getItemSummary: (item) => item.title || "Resume Item",
      arrayFields: {
        logoUrl: { type: "custom",
            render: ({ name, onChange, value }) => {
              const handleImageSelect = (selectedImage: string | null) => {
                if (selectedImage) {
                  onChange(selectedImage);
                }
              };
      
              return (
                <div>
                  {value && (
                    <div className="mb-2 w-full flex justify-center items-center">
                      <img
                        src={value}
                        alt="Selected"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <MediaUploader
                    withMediaLibrary={true}
                    withUnsplash={true}
                    onImageSelect={handleImageSelect}
                  />
                </div>
              );
            }, label: "Logo URL" },
        altText: { type: "text", label: "Alt Text" },
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        href: { type: "text", label: "Link" },
        badges: {
          type: "array",
          label: "Badges",
          getItemSummary: (item) => item.title || "Badge",
          arrayFields: {
            title: { type: "text", label: "Title" },
          },
        },
        period: { type: "text", label: "Period" },
        description: { type: "textarea", label: "Description" },
      },
    },
  },
  defaultProps: {
    title: "Resume",
    subtitle: "My work experience and achievements",
    colorMode: "light",
    resumeData: [
      {
        logoUrl: "https://example.com/logo1.png",
        altText: "Company 1",
        title: "Software Engineer",
        subtitle: "Company 1",
        href: "/resume/company1",
        badges: [{title: "Full-time"}, {title: "2018 - 2022"}],
        period: "2018 - 2022",
        description:
          "Worked on the frontend team, developed new features and maintained existing codebase.",
      },
      {
        logoUrl: "https://example.com/logo2.png",
        altText: "Company 2",
        title: "UI/UX Designer",
        subtitle: "Company 2",
        href: "/resume/company2",
        badges: [{title: "Contract"}, {title: "2015 - 2018"}],
        period: "2016 - 2018",
        description:
          "Designed and prototyped new user interfaces for the company's web and mobile applications.",
      },
    ],
  },
  render: ({ title, subtitle, colorMode, resumeData }: TimelineProps) => (
    <div
      className={`py-10 lg:py-14 mx-auto ${
        colorMode === "dark" ? "bg-gray-900" : ""
      }`}
    >
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2
          className={`text-2xl font-bold md:text-4xl md:leading-tight ${
            colorMode === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-1 ${
            colorMode === "dark" ? "text-neutral-300" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {resumeData.map((item, index) => (
          <ResumeCard key={index} {...item} />
        ))}
      </div>
    </div>
  ),
};

const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer"
      onClick={handleClick}
    >
      <Card className="flex">
        <div className="flex-none h-full">
          <Avatar className="m-3 border size-12 bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow ml-4 items-center flex-col group">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="inline-flex gap-2 items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                {title}
                {badges && (
                  <span className="inline-flex gap-x-1">
                    {badges.map((badge, index) => (
                      <Badge
                        variant="secondary"
                        className="align-middle text-xs"
                        key={index}
                      >
                        {badge.title}
                      </Badge>
                    ))}
                  </span>
                )}
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                {period}
              </div>
            </div>
            {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
          </CardHeader>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? "auto" : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-xs sm:text-sm"
            >
              <p className="pb-4">

              {description}
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </Link>
  );
};
