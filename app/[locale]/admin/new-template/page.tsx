"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Eye } from "lucide-react";
import CreateTemplateForm from "../components/CreateTemplateForm";
import Navbar from "@/app/[locale]/_components/Navbar";
import { Button } from "@/components/ui/button";

export default function NewTemplatePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    category: "",
    features: "", // Features is stored as a comma-separated string
  });
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Convert the comma-separated features string into an array
  const featuresArray = formData.features
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0); // Remove empty strings

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black dark:shadow-[inset_0_0_100px_rgba(139,92,246,0.2)]">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              Create New Template
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Template Preview Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="rounded-2xl overflow-hidden bg-black/80 dark:border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500 border border-violet-500/10">
              <div
                className="relative aspect-video overflow-hidden"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.title || "Template preview"}
                  className={`w-full h-full object-cover transform transition-transform duration-700 ${
                    isImageHovered ? "scale-110" : "scale-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-violet-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${
                    isImageHovered ? "opacity-100" : ""
                  }`}
                />
              </div>

              <div className="p-8">
                <h3 className="font-semibold text-2xl mb-4 text-violet-100">
                  {formData.title || "Template Title"}
                </h3>
                <p className="text-violet-200/70 mb-6 leading-relaxed">
                  {formData.description || "Template description will appear here"}
                </p>

                {/* Render features as an array */}
                <div className="flex flex-wrap gap-2">
                  {featuresArray.map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 rounded-full text-sm font-medium bg-violet-950/50 text-violet-300 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Create Template Form */}
          <div className="backdrop-blur-xl bg-black/50 p-8 rounded-2xl border border-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <CreateTemplateForm formData={formData} setFormData={setFormData} />
          </div>
        </div>
      </div>
    </div>
  );
}