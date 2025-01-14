"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { z } from "zod";
import ProjectForm from "./_components/ProjectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import BuilderLoader from "@/components/BuilderLoader";

// Define TypeScript interfaces
interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  features: string[];
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface FormErrors {
  name?: string;
  path?: string;
  templateId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaIcon?: string;
  response?: string;
}

export default function NewProjectPage() {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [templates, setTemplates] = useState<Template[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Memoize the fetchData function to avoid recreating it on every render
  const fetchData = useCallback(async () => {
    try {
      const [userData, templatesData] = await Promise.all([
        axios.get("/api/user"),
        axios.get("/api/template/all"),
      ]);

      setUser(userData.data);
      setTemplates(templatesData.data);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        response: "Failed to load data. Please refresh the page.",
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <BuilderLoader />;
  }

  return (
    <ProjectForm templates={templates} />
  );
}