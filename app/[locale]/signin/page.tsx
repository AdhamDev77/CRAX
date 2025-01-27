"use client";
import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import {
  Mail,
  Loader2,
  ChevronRight,
  Layout,
  Rocket,
  Palette,
  Code,
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/footer";
import WelcomeSide from "../_components/WelcomeSide";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [oauthLoading, setOAuthLoading] = useState<"google" | "github" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const result = await signIn("credentials", {
          email: email.toLowerCase(),
          otp,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        setError("Authentication failed. Please try again.");
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    },
    [email, otp, router]
  );

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setOAuthLoading(provider);
    setError(null);

    try {
      const result = await signIn(provider, {
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(`${provider} authentication failed. Please try again.`);
      console.error(`${provider} OAuth error:`, error);
    } finally {
      setOAuthLoading(null);
    }
  };

  // Request OTP function
  const requestOTP = async () => {
    if (!email.endsWith("@gmail.com")) {
      setError("Please use a Gmail address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      // Show OTP input field after successful request
      setOtp("");
      setError(null);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error("OTP request error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex">
        {/* Left Section - Feature Showcase (remains the same) */}
          <WelcomeSide />

        {/* Right Section - Sign In Form */}
        <div className="w-full lg:w-1/2 flex pt-14 justify-center p-8 bg-white dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Welcome to CRAX
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Sign in to start building your perfect website
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                {/* OAuth Buttons */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={oauthLoading === "google"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {oauthLoading === "google" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={oauthLoading === "github"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {oauthLoading === "github" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.266.098-2.637 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.838c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.025 2.747-1.025.547 1.371.203 2.384.1 2.637.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.688-4.565 4.935.359.309.678.919.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .267.18.578.688.48C19.137 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  )}
                  Continue with GitHub
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                    <Input
                      type="email"
                      placeholder="Enter your Gmail address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {otp && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      OTP Code
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={otp ? handleSubmit : requestOTP}
                disabled={loading}
                className={cn(
                  "w-full relative group py-3 px-4 rounded-lg transition-all",
                  "bg-gradient-to-r from-violet-600 to-indigo-600",
                  "hover:from-violet-700 hover:to-indigo-700",
                  "dark:from-violet-500 dark:to-indigo-500",
                  "dark:hover:from-violet-600 dark:hover:to-indigo-600",
                  "text-white font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  loading && "opacity-90 cursor-not-allowed"
                )}
              >
                <span className="flex items-center justify-center gap-2 text-sm">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {otp ? "Sign In" : "Request OTP"}
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
