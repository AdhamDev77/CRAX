import React, { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { useToast } from "../../../../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "../../../../app/api/uploadthing/core";

interface FormData {
  name: string;
  description: string;
  image: string;
  category: string;
  subCategory: string;
}


interface ComponentSaveFormProps {
  isOpen: boolean;
  onClose: () => void;
  matchedContent: Record<string, any>;
  matchedZones: Record<string, any>;
}

interface SaveComponentPayload extends FormData {
  content: Record<string, any>;
  zones: Record<string, any>;
}

const ComponentSaveForm: React.FC<ComponentSaveFormProps> = ({
  isOpen,
  onClose,
  matchedContent,
  matchedZones,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    image: '',
    category: '',
    subCategory: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a valid image file (JPEG, PNG, or GIF)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      category: '',
      subCategory: ''
    });
    
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: SaveComponentPayload = {
        ...formData,
        content: matchedContent,
        zones: matchedZones,
      };

      await axios.post("/api/component", payload);

      toast({
        title: "Success",
        description: "Component saved successfully",
        variant: "default",
        className: "bg-green-50 border-green-200",
      });

      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        className: "bg-red-50 border-red-200",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Save Component
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter component name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full min-h-[100px] focus:ring-2 focus:ring-blue-500"
              placeholder="Enter component description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                  subCategory: "", // reset subCategory when category changes
                }));
              }}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select a category</option>
              <option value="layout">Layout</option>
              <option value="navigation">Navigation</option>
              <option value="announcements">Announcements</option>
              <option value="landing">Landing Sections</option>
              <option value="media">Media</option>
              <option value="mediaComponents">Media Components</option>
              <option value="typography">Typography</option>
              <option value="cards">Cards</option>
              <option value="logos">Partners</option>
              <option value="statistics">Social Proof</option>
              <option value="forms">Forms</option>
              <option value="buttons">Buttons</option>
              <option value="timeline">Timelines</option>
            </select>
          </div>

          {/* Subcategory select */}
          <div className="space-y-2">
            <Label htmlFor="subCategory" className="text-sm font-medium">
              Subcategory
            </Label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subCategory: e.target.value,
                }))
              }
              required
              className="w-full border border-gray-300 rounded-md p-2"
              disabled={!formData.category}
            >
              <option value="">Select a subcategory</option>

              {/* layout */}
              {formData.category === "layout" && (
                <>
                  <option value="containers">Containers</option>
                  <option value="spacing">Spacing & Dividers</option>
                </>
              )}

              {/* navigation */}
              {formData.category === "navigation" && (
                <option value="navbar">Navigation Bars</option>
              )}

              {/* announcements */}
              {formData.category === "announcements" && (
                <option value="banners">Banner Announcements</option>
              )}

              {/* landing */}
              {formData.category === "landing" && (
                <>
                  <option value="hero">Hero Sections</option>
                  <option value="sliders">Image Sliders</option>
                </>
              )}

              {/* media */}
              {formData.category === "media" && (
                <>
                  <option value="images">Images & Graphics</option>
                  <option value="video">Video Content</option>
                  <option value="maps">Maps & Location</option>
                </>
              )}

              {/* mediaComponents */}
              {formData.category === "mediaComponents" && (
                <>
                  <option value="videoSections">Video Sections</option>
                  <option value="social">Social Media</option>
                </>
              )}

              {/* typography */}
              {formData.category === "typography" && (
                <option value="headings">Headings</option>
              )}

              {/* cards */}
              {formData.category === "cards" && (
                <>
                  <option value="basicCards">Basic Cards</option>
                  <option value="linkCards">Interactive Cards</option>
                </>
              )}

              {/* logos */}
              {formData.category === "logos" && (
                <>
                  <option value="logoGrids">Logo Displays</option>
                  <option value="partnerSections">Partner Sections</option>
                </>
              )}

              {/* statistics */}
              {formData.category === "statistics" && (
                <>
                  <option value="stats">Statistics</option>
                  <option value="testimonials">Testimonials</option>
                </>
              )}

              {/* forms */}
              {formData.category === "forms" && (
                <>
                  <option value="contact">Contact Forms</option>
                  <option value="faq">FAQ Sections</option>
                </>
              )}

              {/* buttons */}
              {formData.category === "buttons" && (
                <option value="buttonGroups">Button Groups</option>
              )}

              {/* timeline */}
              {formData.category === "timeline" && (
                <>
                  <option value="timelines">Timeline Components</option>
                  <option value="advanced">Advanced Components</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Image
            </Label>

            {/* Show preview if image already selected */}
            {formData.image && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                <img
                  src={formData.image}
                  alt="Selected preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <UploadDropzone<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setFormData((prev) => ({ ...prev, image: res[0].url }));
                  toast({ title: "Uploaded successfully", variant: "default" });
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Error uploading image",
                  description: error.message,
                  variant: "destructive",
                });
              }}
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Component"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentSaveForm;
