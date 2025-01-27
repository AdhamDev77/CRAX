import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OTPPage() {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { email } = router.query; // Get the email from the query parameters

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email || typeof email !== "string") {
        throw new Error("Invalid email address");
      }

      // Verify the OTP by signing in with the CredentialsProvider
      const result = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to the dashboard on successful login
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section - Gradient Background with Animation */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-400/30 to-purple-400/30 blur-3xl animate-blob" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-400/30 to-blue-400/30 blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center space-x-2"
          >
            <span className="text-white text-2xl font-bold">CRAX</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mt-12 mb-4"
          >
            Welcome Back!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-lg mb-12"
          >
            Enter the OTP sent to your email to continue.
          </motion.p>
        </div>
      </div>

      {/* Right Section - OTP Form */}
      <div className="w-full lg:w-1/2 flex pt-14 justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Enter OTP
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              We've sent a 6-digit code to your email. Please enter it below.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
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
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify OTP
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}