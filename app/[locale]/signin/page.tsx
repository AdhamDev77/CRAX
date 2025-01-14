'use client';

import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { 
  Github, 
  Mail,
  Lock,
  Loader2,
  ChevronRight,
  Layout,
  Rocket,
  Palette,
  Code
} from "lucide-react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/footer";

// Memoize the BackgroundAnimation component to avoid re-renders
const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-400/30 to-purple-400/30 blur-3xl animate-blob" />
    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-400/30 to-blue-400/30 blur-3xl animate-blob animation-delay-4000" />
  </div>
);

// Memoize the FeatureCard component to avoid re-renders
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
  >
    <div className="rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-3 w-fit">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-white text-lg font-semibold mt-4">{title}</h3>
    <p className="text-white/70 mt-2 text-sm">{description}</p>
  </motion.div>
);

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the handleSubmit function to avoid re-creating it on every render
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (!result?.error) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [email, password, router]
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex">
        {/* Left Section - Feature Showcase */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 relative overflow-hidden p-12 flex-col justify-between">
          <BackgroundAnimation />
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center space-x-2"
            >
              <Layout className="w-8 h-8 text-white" />
              <span className="text-white text-2xl font-bold">CRAX</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mt-12 mb-4"
            >
              Build Stunning Websites Without Code
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg mb-12"
            >
              Create professional, functional websites for any profession in minutes - no coding required
            </motion.p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 mt-8">
            <FeatureCard 
              icon={Rocket}
              title="Lightning Fast Setup"
              description="Launch your professional website in minutes with our intuitive drag-and-drop builder"
            />
            <FeatureCard 
              icon={Palette}
              title="Professional Templates"
              description="Choose from hundreds of customizable templates designed for every profession"
            />
            <FeatureCard 
              icon={Code}
              title="Fully Functional"
              description="Get all the features you need: forms, booking systems, galleries, and more - no technical skills required"
            />
          </div>
        </div>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-violet-500 transition-colors" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <button 
                      type="button"
                      className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-violet-500 transition-colors" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
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
                      Sign In
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>

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

              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <Github className="h-4 w-4" />
                  Continue with GitHub
                </button>
                
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                  onClick={() => router.push('/signup')}
                >
                  Start building now
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}