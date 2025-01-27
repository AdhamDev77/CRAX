"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import axios from "axios";
import { Link } from "@/i18n/routing";
import { Eye, Pen, Trash2 } from "lucide-react";
import { Template } from "@prisma/client";
import Navbar from "@/app/[locale]/_components/Navbar";
import EditTemplateForm from "../../components/EditTemplateForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditTemplatePage({
  params,
}: {
  params: { templateId: string };
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    features: [] as string[],
  });

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`/api/template/${params.templateId}`);
        setTemplate(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          image: response.data.image,
          category: response.data.category,
          features: response.data.features,
        });
      } catch (error) {
        console.error("Error fetching template:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [params.templateId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/template/${template?.id}`);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
      </div>
    );
  }

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black dark:shadow-[inset_0_0_100px_rgba(139,92,246,0.2)]">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              {template.title} Template
            </span>
          </h1>
          <div className="flex gap-3">
            <Link href={`/template/${template.id}`}>
              <Button className="group bg-black hover:bg-violet-950 text-violet-400 border-2 border-violet-500/30 hover:border-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300">
                <Eye className="mr-2 group-hover:scale-110 transition-transform" />
                Preview
              </Button>
            </Link>
            <Link href={`/admin/template/${template.id}/edit`}>
              <Button className="group bg-violet-600 hover:bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300">
                <Pen className="mr-2 group-hover:scale-110 transition-transform" />
                Build
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="rounded-2xl overflow-hidden bg-black/80 dark:border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500 border border-violet-500/10">
              <div 
                className="relative aspect-video overflow-hidden"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.title}
                  className={`w-full h-full object-cover transform transition-transform duration-700 ${
                    isImageHovered ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-violet-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${
                  isImageHovered ? 'opacity-100' : ''
                }`} />
              </div>

              <div className="p-8">
                <h3 className="font-semibold text-2xl mb-4 text-violet-100">
                  {formData.title}
                </h3>
                <p className="text-violet-200/70 mb-6 leading-relaxed">
                  {formData.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
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

          <div className="backdrop-blur-xl bg-black/50 p-8 rounded-2xl border border-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <EditTemplateForm
              template={template}
              formData={formData}
              setFormData={setFormData}
              onDelete={() => setIsDeleteModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-400">
              Delete Template
            </DialogTitle>
            <DialogDescription className="mt-4 text-violet-200/70">
              This action cannot be undone. The template will be permanently removed from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-black hover:bg-violet-950 border-violet-500/30 text-violet-300"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] gap-2"
            >
              <Trash2 size={16} />
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}