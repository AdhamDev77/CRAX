"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Lock,
  Building2,
  Palette,
  ChevronRight,
  ChevronLeft,
  Github,
  Loader2,
  Plus,
  Trash,
  Rocket,
  Layout,
  Code,
  Circle,
  Check,
} from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Navbar from "../_components/Navbar";
import Footer from "../_components/footer";
import { useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import axios from "axios";
import WelcomeSide from "../_components/WelcomeSide";

// Step Indicator Component
const StepIndicator = ({ currentStep, totalSteps, labels }) => (
  <div className="mb-8 flex flex-col gap-2">
    <div className="flex justify-between mb-2">
      {labels.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all",
              currentStep > index + 1
                ? "bg-violet-600 text-white"
                : currentStep === index + 1
                ? "bg-violet-600/20 text-violet-600 border-2 border-violet-600"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
            )}
          >
            {currentStep > index + 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              currentStep > index + 1
                ? "text-violet-600 dark:text-violet-400"
                : currentStep === index + 1
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500"
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
    <Progress
      value={(currentStep / totalSteps) * 100}
      className="h-2 bg-gray-200 dark:bg-gray-700"
    />
  </div>
);

interface SignupStepProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const SignupStep: React.FC<SignupStepProps> = ({
  children,
  title,
  description,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    {children}
  </motion.div>
);

interface FormData {
  accountType: "individual" | "team" | "";
  userType:
    | "designer"
    | "frontend"
    | "enthusiast"
    | "business"
    | "freelancer"
    | "";
  teamSize: "1-5" | "6-10" | "11+" | "";
  companyName: string;
  companyFocus: string;
  goals: string[];
  designPreferences: string[];
  inviteMembers: { email: string; role: "admin" | "editor" | "viewer" }[];
  experienceLevel: "beginner" | "intermediate" | "advanced" | "";
  referralSource: string;
  email: string;
}

export default function EnhancedSignup({ email }: { email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    accountType: "",
    userType: "",
    teamSize: "",
    companyName: "",
    companyFocus: "",
    goals: [],
    designPreferences: [],
    inviteMembers: [],
    experienceLevel: "",
    referralSource: "",
    email: email || "",
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.accountType) {
          newErrors.accountType = "Please select an account type";
        }
        break;
      case 2:
        if (formData.accountType === "individual" && !formData.userType) {
          newErrors.userType = "Please select a user type";
        }
        if (formData.accountType === "team" && !formData.teamSize) {
          newErrors.teamSize = "Please select a team size";
        }
        if (formData.accountType === "team" && !formData.companyFocus) {
          newErrors.companyFocus = "Please describe your company's focus";
        }
        break;
      case 3:
        if (formData.goals.length === 0) {
          newErrors.goals = "Please select at least one goal";
        }
        break;
      case 4:
        if (formData.designPreferences.length === 0) {
          newErrors.designPreferences =
            "Please select at least one design preference";
        }
        break;
      case 5:
        if (
          formData.accountType === "team" &&
          formData.inviteMembers.length === 0
        ) {
          newErrors.inviteMembers = "Please invite at least one member";
        }
        break;

        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      setLoading(true);
      try {
        // Prepare the data to send to the API
        const payload = {
          email: formData.email,
          accountType: formData.accountType,
          userType: formData.userType,
          goals: formData.goals,
          designPreferences: formData.designPreferences,
          experienceLevel: formData.experienceLevel,
          referralSource: formData.referralSource,
          ...(formData.accountType === "team" && {
            teamName: formData.companyName,
            teamFocus: formData.companyFocus,
            teamSize: formData.teamSize,
          }),
        };

        // Send the data to the API
        const response = await axios.post("/api/auth/signup", payload);

        if (response.status !== 200) {
          throw new Error(response.data.error || "Failed to update user");
        }

        // If it's a team account, invite team members
        if (
          formData.accountType === "team" &&
          formData.inviteMembers.length > 0
        ) {
          for (const member of formData.inviteMembers) {
            console.log(member);
            await axios.post("/api/teams/invite", {
              email: member.email,
              role: member.role,
              teamId: response.data.team.id,
            });
          }
        }

        // Redirect to the dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Submission failed:", error);
        setErrors({
          submit: error instanceof Error ? error.message : "Submission failed",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SignupStep
            title="Who Are You?"
            description="Select your account type to get started."
          >
            <div className="space-y-6">
              <RadioGroup
                value={formData.accountType}
                onValueChange={(value) => updateFormData("accountType", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <label
                  className={cn(
                    "relative flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer transition-all",
                    "hover:border-violet-500",
                    formData.accountType === "individual"
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <User className="w-8 h-8 mb-4 text-violet-500" />
                  <h3 className="font-medium">Individual</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    For personal use or freelancers
                  </p>
                  <RadioGroupItem value="individual" className="sr-only" />
                </label>

                <label
                  className={cn(
                    "relative flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer transition-all",
                    "hover:border-violet-500",
                    formData.accountType === "team"
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <Building2 className="w-8 h-8 mb-4 text-violet-500" />
                  <h3 className="font-medium">Team/Company</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    For teams and businesses
                  </p>
                  <RadioGroupItem value="team" className="sr-only" />
                </label>
              </RadioGroup>
              {errors.accountType && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.accountType}</AlertDescription>
                </Alert>
              )}
            </div>
          </SignupStep>
        );

      case 2:
        return (
          <SignupStep
            title="Tell Us More"
            description="Provide additional details based on your account type."
          >
            <div className="space-y-6">
              {formData.accountType === "individual" && (
                <div className="space-y-4">
                  <Label>What best describes you?</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => updateFormData("userType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="frontend">
                        Frontend Developer
                      </SelectItem>
                      <SelectItem value="enthusiast">Enthusiast</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && (
                    <span className="text-sm text-red-500">
                      {errors.userType}
                    </span>
                  )}
                </div>
              )}

              {formData.accountType === "team" && (
                <div className="space-y-4">
                  <Label>What’s your team size?</Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => updateFormData("teamSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5</SelectItem>
                      <SelectItem value="6-10">6-10</SelectItem>
                      <SelectItem value="11+">11+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.teamSize && (
                    <span className="text-sm text-red-500">
                      {errors.teamSize}
                    </span>
                  )}

                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) =>
                        updateFormData("companyName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>What does your company do?</Label>
                    <Input
                      type="text"
                      placeholder="E.g., E-commerce, SaaS, Education"
                      value={formData.companyFocus}
                      onChange={(e) =>
                        updateFormData("companyFocus", e.target.value)
                      }
                    />
                    {errors.companyFocus && (
                      <span className="text-sm text-red-500">
                        {errors.companyFocus}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SignupStep>
        );

      case 3:
        return (
          <SignupStep
            title="Your Goals"
            description="What are you looking to achieve?"
          >
            <div className="space-y-4">
              <Label>Select your goals (multi-select)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Build a portfolio",
                  "Sell products",
                  "Generate leads",
                  "Create a blog",
                  "Other",
                ].map((goal) => (
                  <div
                    key={goal}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.goals.includes(goal)
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => {
                      const updatedGoals = formData.goals.includes(goal)
                        ? formData.goals.filter((g) => g !== goal)
                        : [...formData.goals, goal];
                      updateFormData("goals", updatedGoals);
                    }}
                  >
                    <span className="font-medium">{goal}</span>
                  </div>
                ))}
              </div>
              {errors.goals && (
                <span className="text-sm text-red-500">{errors.goals}</span>
              )}
            </div>
          </SignupStep>
        );

      case 4:
        return (
          <SignupStep
            title="Design Preferences"
            description="Choose the style that inspires you."
          >
            <div className="space-y-4">
              <Label>Select your design preferences (multi-select)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Minimalist",
                  "Modern",
                  "Creative",
                  "Professional",
                  "Other",
                ].map((style) => (
                  <div
                    key={style}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.designPreferences.includes(style)
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => {
                      const updatedPreferences =
                        formData.designPreferences.includes(style)
                          ? formData.designPreferences.filter(
                              (s) => s !== style
                            )
                          : [...formData.designPreferences, style];
                      updateFormData("designPreferences", updatedPreferences);
                    }}
                  >
                    <span className="font-medium">{style}</span>
                  </div>
                ))}
              </div>
              {errors.designPreferences && (
                <span className="text-sm text-red-500">
                  {errors.designPreferences}
                </span>
              )}
            </div>
          </SignupStep>
        );

      case 5:
        return (
          <SignupStep
            title="Invite Your Team (Optional)"
            description="Add team members to collaborate."
          >
            <div className="space-y-4">
              <Label>Invite Team Members</Label>
              <div className="space-y-2">
                {formData.inviteMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email"
                      value={member.email}
                      onChange={(e) => {
                        const updatedMembers = [...formData.inviteMembers];
                        updatedMembers[index].email = e.target.value;
                        updateFormData("inviteMembers", updatedMembers);
                      }}
                    />
                    <Select
                      value={member.role}
                      onValueChange={(value) => {
                        const updatedMembers = [...formData.inviteMembers];
                        updatedMembers[index].role = value as
                          | "admin"
                          | "editor"
                          | "viewer";
                        updateFormData("inviteMembers", updatedMembers);
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updatedMembers = formData.inviteMembers.filter(
                          (_, i) => i !== index
                        );
                        updateFormData("inviteMembers", updatedMembers);
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    updateFormData("inviteMembers", [
                      ...formData.inviteMembers,
                      { email: "", role: "viewer" },
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
              {errors.inviteMembers && (
                <span className="text-sm text-red-500">
                  {errors.inviteMembers}
                </span>
              )}
            </div>
          </SignupStep>
        );

      case 6:
        return (
          <SignupStep
            title="Create Your Account"
            description="Enter your email and password to complete setup."
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>How experienced are you with website builders?</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) =>
                    updateFormData("experienceLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>How did you hear about us?</Label>
                <Select
                  value={formData.referralSource}
                  onValueChange={(value) =>
                    updateFormData("referralSource", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="search-engine">Search Engine</SelectItem>
                    <SelectItem value="friend">Friend/Colleague</SelectItem>
                    <SelectItem value="ad">Online Ad</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SignupStep>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex">
        {/* Left Section - Feature Showcase */}
        <WelcomeSide />

        {/* Right Section - Onboarding Form */}
        <div className="w-full lg:w-1/2 flex pt-8 justify-center p-8 bg-white dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[40rem]"
          >
            <div></div>
            <StepIndicator
              currentStep={step}
              totalSteps={6}
              labels={[
                "Account Type",
                "Details",
                "Goals",
                "Design",
                "Team",
                "Account",
              ]}
            />

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}

              {step < 6 ? (
                <Button
                  onClick={handleNext}
                  className="ml-auto flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ml-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}
      <Footer />
    </>
  );
}
