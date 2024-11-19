/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/aceternity/bento-grid";
import {
  IconCode,
  IconDatabase,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLayersOff,
  IconPlugConnected,
  IconServer,
} from "@tabler/icons-react";

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
  {
    title: "Responsive Design",
    description: "Create mobile-friendly websites that adapt seamlessly.",
    header: <img className=" rounded-lg h-36" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/651c25b0-2d60-43c8-addf-1df2fd575568/2022/02/14/d0c6b70a-c8ed-4238-91cf-11b25fbf4819/d7520728-1350-4d8a-98df-809c8aebfbe8.gif" />,
    icon: <IconDeviceDesktop className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Intuitive Interface",
    description: "Craft user-centric interfaces that delight your visitors.",
    header: <img className=" rounded-lg h-36" src="https://media1.giphy.com/media/1qfKQPgwSquEgsX7Zv/giphy.gif?cid=6c09b952ql2lwu8npduecjlxv8gk8nbkpkdhyv5qpqm6yra8&ep=v1_gifs_search&rid=giphy.gif&ct=g" />,
    icon: <IconDeviceMobile className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Flexible Layouts",
    description: "Easily build complex and dynamic page structures.",
    header: <img className=" rounded-lg h-36" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/651c25b0-2d60-43c8-addf-1df2fd575568/2022/08/23/71f114fd-91b0-4fcf-b7ef-ba83f57ed4cd/6eb024f5-373c-47ce-b1ac-ebc357ba5cda.gif" />,
    icon: <IconLayersOff className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Content Management",
    description: "Empower clients to manage their website content with ease.",
    header: <img className=" rounded-lg h-36" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/8769cf44-f342-494c-b25f-cc98c9da3e82/2019/07/07/20bac32e-9479-4f32-9a0d-9438664ab408/f682d321-9eab-4909-8907-c7c78bbe5a52.gif" />,
    icon: <IconDatabase className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Powerful APIs",
    description: "Integrate your site with external services and APIs.",
    header: <img className=" rounded-lg h-36" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/651c25b0-2d60-43c8-addf-1df2fd575568/2021/07/19/f0b302a5-7466-48a9-8fe3-d8aa7c732bf3/128958b4-981c-4873-bc0f-7f26458b2b31.gif" />,
    icon: <IconServer className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Custom Functionality",
    description: "Extend your website with tailored features and plugins.",
    header: <img className=" rounded-lg h-36" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/8696077d-830a-4b1e-bd86-9df98f89994a/2021/05/25/71c90c5e-7959-4bd8-ba1e-8010b2f40c61/ec3592b0-3f92-4e66-83d8-7407801f7265.gif" />,
    icon: <IconPlugConnected className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Developer-friendly",
    description: "Empower developers with a streamlined coding experience.",
    header: <img className=" rounded-lg h-36" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/5c3e602a-8647-41f7-bb22-686374bf97ce/2021/08/06/9117665a-2e15-460d-8cc0-27beb93a29db/be8ad0c9-e6e8-4c15-9578-f14b4853874d.gif" />,
    icon: <IconCode className="h-4 w-4 text-neutral-500" />,
  },
];