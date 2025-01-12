/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from "react";
import { ComponentConfig } from "@measured/puck";

type FAQItem = {
  question: string;
  answer: string;
};

export type FAQProps = {
  title: string;
  subtitle: string;
  faqItems: FAQItem[];
  colorMode: "light" | "dark";
};

export const FAQ: ComponentConfig<FAQProps> = {
  label: "FAQ Section",
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
      type: "radio",
      label: "Color Mode",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
    faqItems: {
      section: "content",
      type: "array",
      label: "FAQ Items",
      getItemSummary: (item) => item.question || "Button",
      arrayFields: {
        question: { type: "text", label: "Question" },
        answer: { type: "textarea", label: "Answer" },
      },
    },
  },
  defaultProps: {
    title: "Your questions, answered",
    subtitle: "Answers to the most frequently asked questions.",
    colorMode: "light",
    faqItems: [
      {
        question: "Can I cancel at anytime?",
        answer:
          "Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback.",
      },
      {
        question: "My team has credits. How do we use them?",
        answer:
          "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
      },
    ],
  },
  render: ({ title, subtitle, faqItems, colorMode }: FAQProps) => {
    const isDarkMode = colorMode === "dark";
    const [openItems, setOpenItems] = useState<number[]>([0]);

    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleItem = (index: number) => {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((item) => item !== index)
          : [...prev, index]
      );
    };

    useEffect(() => {
      openItems.forEach((index) => {
        const content = contentRefs.current[index];
        if (content) {
          content.style.height = content.scrollHeight + "px";
        }
      });
    }, [openItems]);

    return (
      <div
        className={`py-10 lg:py-14 mx-auto ${
          isDarkMode ? "bg-gray-900" : ""
        }`}
      >
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2
            className={`text-2xl font-bold md:text-4xl md:leading-tight ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-1 ${
              isDarkMode ? "text-neutral-300" : "text-gray-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="hs-accordion-group">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`hs-accordion rounded-xl p-6 ${
                  openItems.includes(index)
                    ? isDarkMode
                      ? "bg-white/10"
                      : "bg-gray-100"
                    : ""
                }`}
              >
                <button
                  className={`hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start rounded-lg transition ${
                    isDarkMode
                      ? "text-neutral-200 hover:text-neutral-300"
                      : "text-gray-800 hover:text-gray-500"
                  }`}
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItems.includes(index)}
                >
                  {item.question}
                  <svg
                    className={`transform transition-transform duration-300 ${
                      openItems.includes(index) ? "rotate-180" : "rotate-0"
                    } shrink-0 size-5 ${
                      isDarkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  ref={(el: any) => (contentRefs.current[index] = el)}
                  className={`hs-accordion-content overflow-hidden transition-[height] duration-300 ease-in-out`}
                  style={{
                    height: openItems.includes(index) ? "auto" : "0",
                  }}
                >
                  <p
                    className={`mt-2 transition-opacity duration-300 ${
                      openItems.includes(index)
                        ? "opacity-100"
                        : "opacity-0"
                    } ${isDarkMode ? "text-neutral-100" : "text-gray-800"}`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
