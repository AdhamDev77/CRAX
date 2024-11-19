"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter, Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  Layout,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Plus,
  LogOut,
  Settings,
  User,
  Code,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const publicNavItems: NavItem[] = [
  { label: "features", href: "/features" },
  { label: "templates", href: "/templates" },
  { label: "pricing", href: "/pricing" },
];

const userNavItems: NavItem[] = [
  { label: "dashboard", href: "/dashboard" },
  { label: "websites", href: "/websites" },
  { label: "templates", href: "/templates" },
];

const CloudEffect = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute w-[500px] h-[500px] left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-400/10 to-purple-400/10 blur-3xl animate-blob" />
    <div className="absolute w-[300px] h-[300px] left-2/3 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-3xl animate-blob animation-delay-2000" />
  </div>
);

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
];

export default function Navbar({isFixed}:{isFixed?: boolean}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("Navigation");
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (language: string) => {
    router.push("/", { locale: language });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        `${isFixed && isFixed === true ? 'fixed top-0 left-0 right-0' : 'relative shadow'} z-50 transition-all duration-300`,
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent"
      )}
    >
      <CloudEffect />
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Layout className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            CRAX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Nav Links */}
          <div className="flex space-x-6">
            {(session ? userNavItems : publicNavItems).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {t(item.label)}
              </Link>
            ))}
          </div>

          {/* Theme & Language */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Auth Buttons */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{session.user?.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {t("dashboard")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("newWebsite")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className=" cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/signin")}>
                {t("signIn")}
              </Button>
              <Button
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                onClick={() => router.push("/signup")}
              >
                {t("startBuilding")}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {(session ? userNavItems : publicNavItems).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {session ? (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t("dashboard")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/api/auth/signout");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("signOut")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        router.push("/signin");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("signIn")}
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                      onClick={() => {
                        router.push("/signup");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t("startBuilding")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
