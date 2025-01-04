import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { useToast } from "../../../../hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FormData {
  name: string;
  description: string;
  image: string;
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
  matchedZones
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a valid image file (JPEG, PNG, or GIF)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result as string
      }));
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: ''
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: SaveComponentPayload = {
        ...formData,
        content: matchedContent,
        zones: matchedZones
      };

      await axios.post('/api/component', payload);

      toast({
        title: "Success",
        description: "Component saved successfully",
        variant: "default",
        className: "bg-green-50 border-green-200"
      });

      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        className: "bg-red-50 border-red-200"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Save Component</DialogTitle>
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
            <Label htmlFor="image" className="text-sm font-medium">
              Image
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageUpload}
              required
              className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                'Save Component'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentSaveForm;