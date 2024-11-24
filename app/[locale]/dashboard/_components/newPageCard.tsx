import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";

const pageSchema = z.object({
  name: z.string().min(1, "Page name is required"),
  path: z
    .string()
    .regex(
      /^[a-z0-9-_]+$/,
      "Path must only contain letters, numbers, dashes, and underscores"
    ),
  isPublished: z.boolean(),
});

interface NewPageProps {
  site: {
    id: string;
    path: string;
  };
  parentPath?: string;
  onPageCreated: () => void;
  trigger: React.ReactNode;
  templates: any[];
}

const NewPageDialog: React.FC<NewPageProps> = ({ site, parentPath, onPageCreated, trigger, templates }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [path, setPath] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(false);
  const [templateId, setTemplateId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    name?: string;
    path?: string;
    templateId?: string;
    response?: string;
  }>({});

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "-");
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
      setErrors((prev) => ({ ...prev, path: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        path: "Path must only contain letters, numbers, dashes, and underscores",
      }));
    }
  };

  const handleAddNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationResult = pageSchema.safeParse({
      name,
      path,
      isPublished,
    });

    if (!validationResult.success || !templateId) {
      const newErrors: { name?: string; path?: string; templateId?: string } = {};
      validationResult.error?.errors.forEach((error) => {
        newErrors[error.path[0] as keyof typeof newErrors] = error.message;
      });
      if (!templateId) {
        newErrors.templateId = "Template is required";
      }
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const endpoint = parentPath
        ? `/api/site/${site.path}/page/${parentPath}`
        : `/api/site/${site.path}/page`;

      await axios.post(endpoint, {
        name,
        path,
        isPublished,
        siteId: site.id,
        templateId,
        content: {},
      });

      setIsDialogOpen(false);
      onPageCreated();
      resetForm();
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        response: "Error creating new page. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPath("");
    setIsPublished(false);
    setTemplateId(null);
    setErrors({});
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
        </DialogHeader>
        <CardContent>
          <form onSubmit={handleAddNewPage} className="space-y-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="page-name">Page Name</Label>
              <Input
                id="page-name"
                placeholder="About Us"
                value={name}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="page-path">Path</Label>
              <div className="flex items-center border rounded-md px-2">
                <span className="text-sm text-gray-500">
                  {parentPath ? `${parentPath}/` : ""}
                </span>
                <Input
                  id="page-path"
                  placeholder="about-us"
                  value={path}
                  onChange={handlePathChange}
                  className="border-0 focus:ring-0"
                />
              </div>
              {errors.path && (
                <p className="text-sm text-red-500">{errors.path}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="template-select">Select Template</Label>
              <Select
                name="templateId"
                required
                value={templateId || ""}
                onValueChange={(value) => {
                  setTemplateId(value);
                  if (!value) {
                    setErrors((prev) => ({
                      ...prev,
                      templateId: "Template is required",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, templateId: undefined }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template: any) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.templateId && (
                <p className="text-sm text-red-500">{errors.templateId}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={isPublished}
                onCheckedChange={(checked: boolean) => setIsPublished(checked)}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </form>
        </CardContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNewPage} disabled={loading}>
            {loading ? "Creating..." : "Create Page"}
          </Button>
        </DialogFooter>
        {errors.response && (
          <p className="text-sm text-red-500 mt-2">{errors.response}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewPageDialog;
