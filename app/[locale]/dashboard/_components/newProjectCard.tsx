import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import axios from "axios";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import MediaUploader from "@/components/MediaUploader";

// Define validation schemas
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  path: z
    .string()
    .regex(
      /^[a-z0-9-_]+$/,
      "Path must only contain letters, numbers, dashes, and underscores"
    ),
  templateId: z.string().min(1, "Template is required"),
});

const metadataSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  metaIcon: z.string().url("Meta icon must be a valid URL"),
});

export default function NewProjectCard({
  templates,
  setActiveSite,
}: {
  templates: any;
  setActiveSite: any;
}) {
  const confetti = useConfettiStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [newSitePath, setNewSitePath] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaIcon, setMetaIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>();

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const slugifiedName = slugify(newName);
    setName(newName);
    setPath(slugifiedName);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    const isValidPath = /^[a-z0-9-_]+$/.test(newPath);
    if (isValidPath) {
      setPath(newPath);
      setErrors((prev: any) => ({ ...prev, path: undefined }));
    } else {
      setErrors((prev: any) => ({
        ...prev,
        path: "Path must only contain letters, numbers, dashes, and underscores",
      }));
    }
  };

  const handleMetaTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaTitle(e.target.value);
  };

  const handleMetaDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMetaDescription(e.target.value);
  };

  const handleMetaIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaIcon(e.target.value);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleAddNewSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate inputs
    const projectValidationResult = projectSchema.safeParse({
      name,
      path,
      templateId,
    });
    const metadataValidationResult = metadataSchema.safeParse({
      metaTitle,
      metaDescription,
      metaIcon,
    });

    if (!projectValidationResult.success) {
      const newErrors: {
        name?: string;
        path?: string;
        templateId?: string;
      } = {};
      projectValidationResult.error.errors.forEach((error) => {
        newErrors[error.path[0] as keyof typeof newErrors] = error.message;
      });
      setErrors((prev: any) => ({ ...prev, ...newErrors }));
      setLoading(false);
      return;
    }

    if (!metadataValidationResult.success) {
      const newErrors: {
        metaTitle?: string;
        metaDescription?: string;
        metaIcon?: string;
      } = {};
      metadataValidationResult.error.errors.forEach((error) => {
        newErrors[error.path[0] as keyof typeof newErrors] = error.message;
      });
      setErrors((prev: any) => ({ ...prev, ...newErrors }));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/site/${path}`, {
        name,
        templateId,
        path,
        metaTitle,
        metaDescription,
        metaIcon,
      });
      console.log(response);
      setActiveSite(response.data);
      setIsDialogOpen(false);
      confetti.onOpen();
    } catch (err) {
      console.error(err);
      setErrors((prev: any) => ({
        ...prev,
        response: "Error creating new site. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2 justify-center items-center">
          <Plus className="text-sidebar-foreground/70 w-5 h-5" />
          <span>New Project</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[380px]">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="project-name">Project name</Label>
                    <Input
                      id="project-name"
                      placeholder="CRAX"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                    />
                    {errors?.name && (
                      <p className="text-red-600 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="project-path">Path</Label>
                    <div className="flex items-center border dark:border-stone-800 border-stone-300 rounded-md px-2">
                      <h5>http://CRAX.com/site/</h5>
                      <Input
                        type="text"
                        name="newSitePath"
                        placeholder="path"
                        className="outline-none border-0 focus:ring-0 focus:outline-none bg-transparent flex-1 mx-1"
                        id="project-path"
                        value={path}
                        onChange={handlePathChange}
                        required
                      />
                    </div>
                    {errors?.path && (
                      <p className="text-red-600 text-sm">{errors.path}</p>
                    )}
                    <p className="text-[13px] text-stone-600 dark:text-stone-300">
                      you can edit the path as you want
                    </p>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="templateId">Default Template</Label>
                    <Select
                      name="templateId"
                      required
                      value={templateId}
                      onValueChange={(value) => {
                        setTemplateId(value);
                        if (!value) {
                          setErrors((prev: any) => ({
                            ...prev,
                            templateId: "Template is required",
                          }));
                        } else {
                          setErrors((prev: any) => ({
                            ...prev,
                            templateId: undefined,
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.prof}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors?.templateId && (
                      <p className="text-red-600 text-sm">
                        {errors.templateId}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Button onClick={handleNextStep}>Next</Button>
            </CardFooter>
          </>
        )}

{step === 2 && (
  <>
    <CardHeader>
      <CardTitle>Add Metadata</CardTitle>
      <CardDescription>
        Provide additional details for your new project.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleAddNewSite}>
        <div className="grid w-full items-center gap-6">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              placeholder="My CRAX Project"
              type="text"
              value={metaTitle}
              onChange={handleMetaTitleChange}
            />
            {errors?.metaTitle && (
              <p className="text-red-600 text-sm">{errors.metaTitle}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="meta-description">Meta Description</Label>
            <Input
              id="meta-description"
              placeholder="A brief description of my CRAX project"
              type="text"
              value={metaDescription}
              onChange={handleMetaDescriptionChange}
            />
            {errors?.metaDescription && (
              <p className="text-red-600 text-sm">
                {errors.metaDescription}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="meta-icon">Meta Icon</Label>
            <div className="flex gap-4 items-center mt-2">
              {metaIcon && (
                <img src={metaIcon} alt="Meta Icon Preview" className="w-32" />
              )}
              <MediaUploader
                withMediaLibrary={false}
                withUnsplash={false}
                onImageSelect={(imageUrl) => setMetaIcon(imageUrl || "")}
              />
            </div>
            {errors?.metaIcon && (
              <p className="text-red-600 text-sm">{errors.metaIcon}</p>
            )}
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => setStep(1)}>
        Back
      </Button>
      <Button onClick={handleAddNewSite} disabled={loading}>
        {loading ? "Deploying ..." : "Deploy"}
      </Button>
    </CardFooter>
    {errors.response && (
      <p className="text-red-600 text-sm">{errors.response}</p>
    )}
  </>
)}

      </DialogContent>
    </Dialog>
  );
}
