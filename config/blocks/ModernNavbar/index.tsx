/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from "react";
import { ComponentConfig, Field } from "@measured/puck";
import { ChevronDown, Image, Type, Space } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import ColorPickerComponent from "@/components/ColorPicker";
import SpacingAdjustor from "@/components/SpacingAdjustor";
import ColorPanel from "@/components/ColorPanel";

export type NavbarLink = {
  name: string;
  url: string;
  type?: "single" | "submenu";
  submenu?: NavbarLink[];
};

export type ModernNavbarProps = {
  logo?: string;
  direction?: string;
  logoHeight?: number;
  bgColor?: string;
  fontColor?: string;
  fontSize?: string;
  fontWeight?: string;
  spacing: {
    padding: string;
    margin: string;
  };
  itemSpacing?: string;
  links: NavbarLink[];
};

type NavbarLinkField = {
  name: Field<string>;
  url: Field<string>;
  type: Field<"single" | "submenu">;
  submenu?: {
    type: "array";
    arrayFields: {
      name: Field<string>;
      url: Field<string>;
    };
  };
};

export const ModernNavbar: ComponentConfig<ModernNavbarProps> = {
  label: "Modern Navbar",
  image: "/components/navbar.png",
  fields: {
    logo: {
      section: "content",
      label: "Logo",
      type: "custom",
      render: ({ name, onChange, value }) => {
        const handleImageSelect = (selectedImage: string | null) => {
          if (selectedImage) {
            onChange(selectedImage);
          }
        };

        return (
          <div>
            <h2 className="font-semibold flex gap-2 items-center mb-2">
              <Image className="w-4 h-4" /> Logo
            </h2>
            {value && (
              <div className="mb-2 w-full flex justify-center items-center">
                <img
                  src={value}
                  alt="Selected"
                  className="h-12 object-cover rounded"
                />
              </div>
            )}
            <MediaUploader
              withMediaLibrary={true}
              withUnsplash={true}
              onImageSelect={handleImageSelect}
            />
          </div>
        );
      },
    },
    direction: {
      type: "radio",
      label: "Direction",
      options: [
        { label: "To Right", value: "ltr" },
        { label: "To Left", value: "rtl" },
      ],
    },
    logoHeight: {
      type: "number",
      label: "Logo Height (px)",
    },
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    fontColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    fontSize: {
      type: "radio",
      label: "Font Size",
      options: [
        { label: "Small", value: "text-base" },
        { label: "Medium", value: "text-lg" },
        { label: "Large", value: "text-xl" },
      ],
    },
    fontWeight: {
      type: "select",
      label: "Font Weight",
      options: [
        { label: "Normal", value: "font-normal" },
        { label: "Medium", value: "font-medium" },
        { label: "Semibold", value: "font-semibold" },
        { label: "Bold", value: "font-bold" },
      ],
    },
    spacing: {
      label: "Spacing",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <SpacingAdjustor value={value} onChange={onChange} unit="px" />
      ),
    },
    itemSpacing: {
      type: "select",
      label: "Item Spacing",
      options: [
        { label: "Tight", value: "gap-2" },
        { label: "Normal", value: "gap-4" },
        { label: "Loose", value: "gap-6" },
        { label: "Giant", value: "gap-10" },
      ],
    },
    links: {
      section: "content",
      type: "array",
      getItemSummary: (item) => item.name || "Link",
      label: "Navbar Links",
      arrayFields: {
        name: { type: "text", label: "Link Name" },
        url: { type: "text", label: "URL" },
        type: {
          type: "select",
          label: "Link Type",
          options: [
            { label: "Single", value: "single" },
            { label: "Submenu", value: "submenu" },
          ],
        },
        submenu: {
          type: "array",
          getItemSummary: (item: { name: any }) => item.name || "Link",
          label: "Submenu Links",
          arrayFields: {
            name: { type: "text", label: "Submenu Name" },
            url: { type: "text", label: "Submenu URL" },
          },
        },
      } as NavbarLinkField,
    },
  },
  defaultProps: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/TK_Maxx_Logo.svg/2560px-TK_Maxx_Logo.svg.png",
    direction: "ltr",
    logoHeight: 28,
    bgColor: "#ffffff",
    fontColor: "#1f2937",
    fontSize: "text-lg",
    fontWeight: "font-medium",
    spacing: { padding: "4px 0px 4px 0px", margin: "0px 0px 0px 0px" },
    itemSpacing: "gap-4",
    links: [
      { name: "Home", url: "/", type: "single" },
      { name: "About", url: "/about", type: "single" },
      {
        name: "Services",
        url: "#",
        type: "submenu",
        submenu: [
          { name: "Consulting", url: "/services/consulting", type: "single" },
          { name: "Development", url: "/services/development", type: "single" },
        ],
      },
    ],
  },
  render: ({
    logo,
    direction,
    logoHeight,
    bgColor,
    fontColor,
    fontSize,
    fontWeight,
    spacing,
    itemSpacing,
    links,
  }: ModernNavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 0);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const toggleDropdown = (name: string) => {
      setActiveDropdown(activeDropdown === name ? null : name);
    };

    const renderSubmenu = (submenuItems?: NavbarLink[]) => {
      if (!submenuItems) return null;

      return (
        <div
          className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-10`}
          style={{ backgroundColor: bgColor }}
        >
          <div className="py-1">
            {submenuItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className={`block px-4 py-2 ${fontSize} ${fontWeight}`}
                style={{ color: fontColor }}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      );
    };

    const renderLink = (link: NavbarLink) => {
      if (link.type === "submenu") {
        return (
          <div className="relative" key={link.name}>
            <button
              onClick={() => toggleDropdown(link.name)}
              className={`flex items-center ${fontSize} ${fontWeight} px-3 py-2 gap-2 rounded-md`}
              style={{ color: fontColor }}
            >
              {link.name}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === link.name ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeDropdown === link.name && renderSubmenu(link.submenu)}
          </div>
        );
      }

      return (
        <a
          key={link.name}
          href={link.url}
          className={`px-3 py-2 rounded-md ${fontSize} ${fontWeight}`}
          style={{ color: fontColor }}
        >
          {link.name}
        </a>
      );
    };

    return (
<nav className={` w-full z-50 transition-all duration-300 ${
        scrolled ? "top-4 fixed" : "top-0 relative"
      }`}>
        <nav
          className={`w-full transition-all duration-300 ${
            scrolled 
              ? `mx-auto max-w-[66rem] rounded-[26px] bg-opacity-90 backdrop-blur-md` 
              : `w-full`
          }`}
          style={{
            background: scrolled 
              ? `${bgColor}` 
              : bgColor,
              padding: spacing.padding,
              margin: spacing.margin,
            backdropFilter: scrolled ? "blur(8px)" : "none",
          }}
        >
          <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${
            scrolled ? "max-w-7xl" : "w-full"
          }`}>

            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand Section */}
              <div className={`flex-shrink-0 flex ${direction === "rtl" ? "flex-row-reverse" : "flex-row"} items-center`}>
                {logo && (
                  <img
                    src={logo}
                    alt="logo"
                    style={{ height: `${logoHeight}px` }}
                    className="object-contain"
                  />
                )}
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div className={`ml-10 flex ${direction === "rtl" ? "flex-row-reverse" : "flex-row"} items-center ${itemSpacing}`}>
                  {links.map((link) => renderLink(link))}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md"
                  style={{ color: fontColor }}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1" style={{ backgroundColor: bgColor }}>
                {links.map((link) => (
                  <div key={link.name}>
                    {link.type === "single" ? (
                      <a
                        href={link.url}
                        className={`block px-3 py-2 rounded-md ${fontSize} ${fontWeight}`}
                        style={{ color: fontColor }}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <div>
                        <button
                          onClick={() => toggleDropdown(link.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${fontSize} ${fontWeight}`}
                          style={{ color: fontColor }}
                        >
                          {link.name}
                          <ChevronDown
                            className={`w-4 h-4 ${
                              activeDropdown === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {activeDropdown === link.name && link.submenu && (
                          <div className="ml-4">
                            {link.submenu.map((subItem) => (
                              <a
                                key={subItem.name}
                                href={subItem.url}
                                className={`block px-3 py-2 rounded-md ${fontSize} ${fontWeight}`}
                                style={{ color: fontColor }}
                              >
                                {subItem.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </nav>
    );
  },
};