import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Settings,
  Palette,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/i18n/routing";
import { z } from "zod";
import axios from "axios";

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  features: string[];
}

interface FormData {
  name: string;
  path: string;
  templateId: string;
  metaTitle: string;
  metaDescription: string;
  metaIcon: string;
}

interface ProjectFormProps {
  templates: Template[];
}

const Steps = ({
  currentStep,
  completedSteps,
}: {
  currentStep: number;
  completedSteps: number[];
}) => {
  const steps = [
    {
      number: 1,
      title: "Project Details",
      icon: Settings,
      description: "Set up your project basics",
    },
    {
      number: 2,
      title: "Template",
      icon: Palette,
      description: "Choose your design",
    },
    {
      number: 3,
      title: "Customize",
      icon: Globe,
      description: "Add final touches",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-[110%] left-0 w-full h-1 bg-white dark:bg-gray-800 -translate-y-1/2">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.number);
            const isActive = currentStep === step.number;
            const isUpcoming = currentStep < step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative"
              >
                <motion.div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600"
                        : ""
                    }
                    ${isCompleted ? "bg-violet-600" : ""}
                    ${isUpcoming ? "bg-gray-100 dark:bg-gray-800" : ""}
                    shadow-lg transition-all duration-300
                  `}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isCompleted ? 360 : 0,
                  }}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isUpcoming ? "text-gray-400" : "text-white"
                    }`}
                  />
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                <motion.div
                  className="mt-4 text-center"
                  animate={{
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  <div
                    className={`font-semibold mb-1 ${
                      isActive
                        ? "text-violet-600"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {step.title}
                  </div>
                  {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                    {step.description}
                  </div> */}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MediaUploader = ({
  onImageSelect,
  currentImage,
}: {
  onImageSelect: (image: string) => void;
  currentImage?: string;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="icon-upload"
      />
      <label
        htmlFor="icon-upload"
        className="cursor-pointer flex flex-col items-center justify-center"
      >
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Icon Preview"
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-600 flex flex-col items-center justify-center gap-2 group-hover:border-violet-500 transition-colors">
            <Upload className="w-6 h-6 text-violet-500" />
            <span className="text-sm text-violet-500">Upload Icon</span>
          </div>
        )}
      </label>
    </div>
  );
};

const ProjectForm: React.FC<ProjectFormProps> = ({ templates }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    path: "",
    templateId: "",
    metaTitle: "",
    metaDescription: "",
    metaIcon: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData | "submit", string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        path: value.toLowerCase().replace(/\s+/g, "_"),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number): boolean => {
    let stepErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.name) stepErrors.name = "Project name is required";
      if (!formData.path) stepErrors.path = "Path is required";
      if (!/^[a-z0-9-_]+$/.test(formData.path)) {
        stepErrors.path =
          "Path must only contain lowercase letters, numbers, dashes, and underscores";
      }
    }

    if (step === 2) {
      if (!formData.templateId)
        stepErrors.templateId = "Please select a template";
    }

    if (step === 3) {
      if (!formData.metaTitle) stepErrors.metaTitle = "Meta title is required";
      if (!formData.metaDescription)
        stepErrors.metaDescription = "Meta description is required";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentStep((prev) => prev - 1);
  };

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

  const validateForm = () => {
    const projectValidation = projectSchema.safeParse(formData);
    const metadataValidation = metadataSchema.safeParse(formData);

    if (!projectValidation.success || !metadataValidation.success) {
      const newErrors = {};

      if (!projectValidation.success) {
        projectValidation.error.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });
      }

      if (!metadataValidation.success) {
        metadataValidation.error.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });
      }

      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`/api/site/${formData.path}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/dashboard");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        response: "Error creating new site. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 to-indigo-300 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto">
        <Steps currentStep={currentStep} completedSteps={completedSteps} />

        <div className="max-w-4xl mx-auto">
          {errors.submit && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-8">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-center max-w-2xl mx-auto">
                      <Badge variant="secondary" className="mb-4">
                        Step 1 of 3
                      </Badge>
                      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Project Details
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Let&apos;s start with the basics of your project. Choose
                        a memorable name and a clean URL path.
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div>
                        <Label htmlFor="name" className="text-base">
                          Project Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="My Awesome Project"
                          className="mt-2"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="path" className="text-base">
                          Project Path
                        </Label>
                        <div className="flex items-center mt-2 border rounded-lg bg-gray-50 dark:bg-gray-900">
                          <span className="px-4 text-gray-500 dark:text-gray-400">
                            crax.com/site/
                          </span>
                          <Input
                            id="path"
                            name="path"
                            value={formData.path}
                            onChange={handleChange}
                            className="border-0 bg-transparent"
                          />
                        </div>
                        {errors.path && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.path}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="text-center max-w-2xl mx-auto">
                      <Badge variant="secondary" className="mb-4">
                        Step 2 of 3
                      </Badge>
                      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Choose a Template
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a template that best fits your needs. All
                        templates are fully customizable.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              templateId: template.id,
                            }));
                            setErrors((prev) => ({ ...prev, templateId: "" }));
                          }}
                          className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ease-in-out ${
                            formData.templateId === template.id
                              ? "border-violet-600 bg-violet-50/50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/20"
                              : "border-gray-100 dark:border-gray-700 hover:border-violet-400 hover:scale-[1.02]"
                          }`}
                        >
                          <div className="relative aspect-video w-full">
                            <img
                              src={template.image}
                              alt={template.title}
                              className="w-full h-full object-cover"
                            />
                            {formData.templateId === template.id && (
                              <div className="absolute inset-0 bg-violet-500/10" />
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {template.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {template.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {template.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.templateId && (
                      <p className="text-red-500 text-sm text-center">
                        {errors.templateId}
                      </p>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="text-center max-w-2xl mx-auto">
                      <Badge variant="secondary" className="mb-4">
                        Step 3 of 3
                      </Badge>
                      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Customize Your Site
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Add metadata to improve your site&apos;s visibility and
                        SEO performance.
                      </p>
                    </div>

                    <div className="p-8 space-y-8">
                      <div>
                        <Label
                          htmlFor="metaTitle"
                          className="text-base font-medium"
                        >
                          Meta Title
                        </Label>
                        <Input
                          id="metaTitle"
                          name="metaTitle"
                          value={formData.metaTitle}
                          onChange={handleChange}
                          placeholder="My Professional Website"
                          className="mt-2"
                        />
                        {errors.metaTitle && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.metaTitle}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="metaDescription"
                          className="text-base font-medium"
                        >
                          Meta Description
                        </Label>
                        <Input
                          id="metaDescription"
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleChange}
                          placeholder="A brief description of your website"
                          className="mt-2"
                        />
                        {errors.metaDescription && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.metaDescription}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-4 block">
                          Site Icon
                        </Label>
                        <Card className="border-dashed bg-gray-50 dark:bg-gray-900">
                          <CardContent className="p-8">
                            <div className="flex flex-col items-center justify-center">
                              <MediaUploader
                                onImageSelect={(image) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    metaIcon: image,
                                  }))
                                }
                                currentImage={formData.metaIcon}
                              />
                              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Recommended size: 32x32px. Supports PNG, JPG
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-700">
                  {currentStep > 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <motion.button
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Project...
                        </>
                      ) : (
                        <>
                          Launch Project
                          <Rocket className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-sm text-black dark:text-white"
          >
            Need help? Check out our{" "}
            <a
              href="#"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              documentation
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              contact support
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
