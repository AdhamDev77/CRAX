/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  AppWindow,
  AppWindowIcon,
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  LucideAppWindow,
  Map,
  Moon,
  MoreHorizontal,
  Pen,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareCode,
  Sun,
  Terminal,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import { Link, redirect, usePathname, useRouter } from "@/i18n/routing";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { Site } from "../types";
import ScreenshotComponent from "../actions/getScreenshot";
import NewProjectCard from "./_components/newProjectCard";
import { BarListAnalytics } from "./_components/barListAnalytics";
import { AreaChartAnalytics } from "./_components/areaChartAnalytics";
import MediaLibrary from "./_components/MediaLibrary";
import ProjectTabs from "./_components/projectTabs";
import { Loader } from "@/packages/core/components/Loader";
import LoaderComponent from "@/components/loader";
import LeadsManagment from "./_components/LeadsManagement";
import SiteMap from "./_components/siteMap";
import Image from "next/image";
import { signOut } from "next-auth/react";
import SiteSettings from "./_components/siteSettings";
import BuilderLoader from "@/components/BuilderLoader";
import EmptyDashboard from "./_components/EmptyDashboard";
import { Button } from "@/components/ui/button";
import theme from "tailwindcss/defaultTheme";
import { useTheme } from "next-themes";
import AnalyticsDashboard from "./_components/AnalyticsDashboard";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [templates, setTemplates] = React.useState([]);
  const [error, setError] = React.useState("");
  const [activeSite, setActiveSite] = React.useState<Site | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<string>("Analytics");
  const { theme, setTheme } = useTheme();
  // if (!session || !session.user || !session.user.email) {
  //   router.push("/signin"); // Fixed redirection
  // }
  React.useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [userData, templatesData] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/template/all"),
        ]);

        console.log(userData);

        setUser(userData.data);
        setTemplates(templatesData.data);

        // Set active site if user has any sites
        if (userData.data.sites && userData.data.sites.length > 0) {
          setActiveSite(userData.data.sites[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status]);

  // Ensure that firstName and lastName are properly handled
  const userName = user
    ? `${user.firstName || "Unknown"} ${user.lastName || "User"}`
    : "Loading...";

  const data = {
    user: {
      name: userName,
      email: session?.user.email || "No email available", // Fallback for email
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "CRAX Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "CRAX Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "CRAX Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: Terminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  const [activeTeam, setActiveTeam] = React.useState(data.teams[0]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleSiteClick = (site: Site) => {
    setActiveSite(site);
  };

  const renderBreadcrumb = () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        {activeSite && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{activeSite.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {activeSite && selectedTab && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedTab}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <>
      {loading ? (
        <BuilderLoader />
      ) : (
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                          <activeTeam.logo className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {activeTeam.name}
                          </span>
                          <span className="truncate text-xs">
                            {activeTeam.plan}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Teams
                      </DropdownMenuLabel>
                      {data.teams.map((team, index) => (
                        <DropdownMenuItem
                          key={team.name}
                          onClick={() => setActiveTeam(team)}
                          className="gap-2 p-2"
                        >
                          <div className="flex size-6 items-center justify-center rounded-sm border">
                            <team.logo className="size-4 shrink-0" />
                          </div>
                          {team.name}
                          <DropdownMenuShortcut>
                            ⌘{index + 1}
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 p-2">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                          <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          Add team
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarMenu>
                  {user.sites && user.sites.length > 0 && (
                    <>
                      {user.sites.map((site: Site) => (
                        <SidebarMenuItem key={site.name}>
                          <SidebarMenuButton
                            asChild
                            className={
                              activeSite?.name === site.name
                                ? "bg-sidebar-accent"
                                : ""
                            }
                          >
                            <button onClick={() => handleSiteClick(site)}>
                              {site.metaIcon ? (
                                <img
                                  className="w-6"
                                  alt={`${site.name} project`}
                                  src={site.metaIcon}
                                />
                              ) : (
                                <LucideAppWindow />
                              )}

                              <span>{site.name}</span>
                            </button>
                          </SidebarMenuButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuAction showOnHover>
                                <MoreHorizontal />
                                <span className="sr-only">Actions</span>
                              </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="w-48 rounded-lg"
                              side="bottom"
                              align="end"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/site/${site.path}`)
                                }
                              >
                                <AppWindowIcon className="text-muted-foreground w-5 h-5" />
                                <span>View Project</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/site/${site.path}/edit`)
                                }
                              >
                                <Pen className="text-muted-foreground w-5 h-5" />
                                <span>Edit Project</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Forward className="text-muted-foreground w-5 h-5" />
                                <span>Share Project</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Trash2 className="text-muted-foreground" />
                                <span>Delete Project</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuItem>
                      ))}
                    </>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                      <Link
                        href={"/create"}
                        className="flex gap-2 justify-center items-center"
                      >
                        <Plus className="text-sidebar-foreground/70 w-5 h-5" />
                        <span>New Project</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                  {data.navMain.map((item) => (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={data.user.avatar}
                            alt={data.user.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white">
                            {user.firstName?.charAt(0).toUpperCase()}
                            {user.lastName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={data.user.avatar}
                              alt={data.user.name}
                            />
                            <AvatarFallback className="rounded-lg">
                              CN
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {data.user.name}
                            </span>
                            <span className="truncate text-xs">
                              {data.user.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Sparkles />
                          Upgrade to Pro
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard />
                          Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className=" cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <header className="flex border-b h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {renderBreadcrumb()}
              </div>
              <Button
              className="mx-3"
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
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {activeSite ? (
                <>
                  <ProjectTabs
                    selectedSite={activeSite}
                    onTabChange={handleTabChange}
                  />
                  {selectedTab === "Analytics" && (
                    <>
                      {/* <AreaChartAnalytics /> */}
                      {/* <BarListAnalytics /> */}
                      <AnalyticsDashboard activeSite={activeSite} />
                    </>
                  )}
                  {selectedTab === "Media library" && (
                    <>
                      <MediaLibrary selectedSite={activeSite} />
                    </>
                  )}
                  {selectedTab === "Site map" && (
                    <>
                      <SiteMap site={activeSite} templates={templates} />
                    </>
                  )}
                  {selectedTab === "Settings" && (
                    <>
                      <SiteSettings selectedSite={activeSite} />
                    </>
                  )}
                  {selectedTab === "Leads" && (
                    <LeadsManagment leads={activeSite.leads} />
                  )}
                </>
              ) : (
                <EmptyDashboard />
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
