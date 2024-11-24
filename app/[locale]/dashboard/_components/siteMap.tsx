import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Globe,
  Layout,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NewPageDialog from "./newPageCard";
import { Link } from "@/i18n/routing";

type Page = {
  id: string;
  name: string;
  path: string;
  content: any;
  isPublished: boolean;
  parentId: string | null;
  children: Page[];
  siteId: string;
  createdAt: string;
  updatedAt: string;
};

interface Site {
  id: string;
  path: string;
  name: string;
}

interface SiteMapProps {
  site: Site;
  templates: any;
}

const SiteMap: React.FC<SiteMapProps> = ({ site, templates }) => {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/site/${site.path}/page`);
      const organizedPages = organizePages(response.data);
      setPages(organizedPages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to load pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [site.path]);

  const organizePages = (flatPages: Page[]): Page[] => {
    const pagesMap = new Map<string, Page>();
    const rootPages: Page[] = [];

    // First pass: create map of all pages
    flatPages.forEach((page) => {
      pagesMap.set(page.id, { ...page, children: [] });
    });

    // Second pass: organize into hierarchy
    flatPages.forEach((page) => {
      const currentPage = pagesMap.get(page.id)!;
      if (page.parentId) {
        const parentPage = pagesMap.get(page.parentId);
        if (parentPage) {
          parentPage.children.push(currentPage);
        }
      } else {
        rootPages.push(currentPage);
      }
    });

    return rootPages;
  };

  const handleDeletePage = async (pagePath: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/site/${site.path}/page/${pagePath}`);
      await fetchPages();
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleNode = (pageId: string) => {
    setExpandedNodes((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(pageId)) {
        newExpanded.delete(pageId);
      } else {
        newExpanded.add(pageId);
      }
      return newExpanded;
    });
  };

  const renderPageNode = (page: Page, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedNodes.has(page.id);
    const isHomePage = page.path === "home";

    return (
      <motion.div
        key={page.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`border-gray-200 dark:border-gray-700 ${
          level > 0 ? "ml-6" : ""
        }`}
      >
        <div className="relative">
          <div
            className={`
            flex items-center p-4 mb-2 rounded-lg
            bg-white dark:bg-blue-800/20
            border border-gray-200 dark:border-blue-700/30
            hover:bg-blue-50 dark:hover:bg-blue-700/30
            transition-colors duration-200
          `}
          >
            <div
              className="flex items-center flex-1 cursor-pointer space-x-3"
              onClick={() => hasChildren && toggleNode(page.id)}
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800">
                {isHomePage ? (
                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : hasChildren ? (
                  <Layout className="w-5 h-5 text-gray-700 dark:text-slate-100" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-700 dark:text-slate-100" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {page.name}
                  {!page.isPublished && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-200 bg-gray-100 dark:bg-blue-900/20 px-2 py-[2px] rounded">
                      Draft
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {page.path}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NewPageDialog
                site={site}
                templates={templates}
                parentPath={page.path}
                onPageCreated={fetchPages}
                trigger={
                  <button
                    className="p-2 rounded-full text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700/30"
                    aria-label="Add new page"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                }
              />

              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-700/30">
                  <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link className="flex gap-1" target="_blank" href={`/site/${site.path}/${page.path}/edit`}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <Link className="flex gap-1" target="_blank" href={`/site/${site.path}/${page.path}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                    </Link>
                  </DropdownMenuItem>
                  {!isHomePage && (
                    <DropdownMenuItem
                      onClick={() => handleDeletePage(page.path)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(page.id);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-700/30"
                >
                  <ChevronRight
                    className={`w-4 h-4 text-gray-600 dark:text-white transition-transform duration-200 ${
                      isExpanded ? "transform rotate-90" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-6"
            >
              {page.children.map((childPage) =>
                renderPageNode(childPage, level + 1)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading site map...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-black dark:text-white">
          Site Map
        </h1>
        <NewPageDialog
          site={site}
          onPageCreated={fetchPages}
          templates={templates}
          trigger={
            <Button
              variant="outline"
              className="gap-2"
              aria-label="Add root page"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add Root Page
            </Button>
          }
        />
      </div>
      <Card className="w-full">
        <CardHeader></CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <Layout className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pages yet.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Click &quot;Add Root Page&quot; to create your first page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => renderPageNode(page))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SiteMap;