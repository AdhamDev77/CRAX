/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from "react";
import { ComponentConfig, Field } from "@measured/puck";
import { ChevronDown, Image, Type, Space, Move } from "lucide-react";
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

export type NavbarProps = {
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
  borderBottom?: boolean;
  borderColor?: string;
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

export const Navbar: ComponentConfig<NavbarProps> = {
  label: "Navbar",
  fields: {
    logo: {
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
    links: {
      type: "array",
      getItemSummary: (item) => item.name || "Link",
      label: "Navbar Links",
      arrayFields: {
        name: { type: "text", label: "Link Name" },
        url: { type: "text", label: "URL" },
        type: {
          type: "radio",
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
    logoHeight: {
      type: "number",
      label: "Logo Height (px)",
    },
    direction: {
      type: "radio",
      label: "Direction",
      options: [
        { label: "To Right", value: "ltr" },
        { label: "To Left", value: "rtl" },
      ],
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
    borderColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    borderBottom: {
      type: "radio",
      label: "Show Border Bottom",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
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
  },
  defaultProps: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/TK_Maxx_Logo.svg/2560px-TK_Maxx_Logo.svg.png",
    logoHeight: 40,
    direction: "ltr",
    bgColor: "#ffffff",
    fontColor: "#1f2937",
    fontSize: "text-base",
    fontWeight: "font-medium",
    spacing: { padding: "10px 0px 10px 0px", margin: "0px 0px 0px 0px" },
    itemSpacing: "gap-4",
    borderBottom: true,
    borderColor: "#e5e7eb",
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
  resolveFields: async (data, { fields }) => {
    if (data.props.borderBottom == false) {
      return {
        ...fields,
        borderColor: undefined,
      };
    }
    return fields;
  },
  render: ({
    logo,
    logoHeight,
    bgColor,
    fontColor,
    fontSize,
    fontWeight,
    spacing,
    itemSpacing,
    borderBottom,
    direction,
    borderColor,
    links,
  }: NavbarProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const submenuRefs = useRef([]);
  
    const toggleSubmenu = (index) => {
      setOpenSubmenu(openSubmenu === index ? null : index);
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          openSubmenu !== null &&
          submenuRefs.current[openSubmenu] &&
          !submenuRefs.current[openSubmenu]?.contains(event.target)
        ) {
          setOpenSubmenu(null);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [openSubmenu]);
  
    const NavLink = ({ link, idx }) => {
      if (link.type === "submenu") {
        return (
          <div className="relative group">
            <button
              onClick={() => toggleSubmenu(idx)}
              className={`flex ${
                direction == "rtl" ? "flex-row-reverse" : "flex-row"
              } items-center ${fontSize} ${fontWeight} gap-2 px-3 py-2 rounded-md`}
              style={{ color: fontColor }}
            >
              {link.name}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openSubmenu === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              ref={(el) => {
                submenuRefs.current[idx] = el;
              }}
              className={`absolute left-0 z-10 w-48 py-2 mt-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 
                ${openSubmenu === idx 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 -translate-y-4 pointer-events-none"}`}
              style={{
                backgroundColor: bgColor,
                color: fontColor,
              }}
            >
              {link.submenu?.map((sublink, subIdx) => (
                <li key={subIdx}>
                  <a
                    href={sublink.url}
                    style={{ color: fontColor }}
                    className={`block px-4 py-2 ${fontSize} ${fontWeight}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {sublink.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      }
  
      return (
        <a
          href={link.url}
          style={{ color: fontColor }}
          className={`px-3 py-2 ${fontSize} ${fontWeight} rounded-md`}
        >
          {link.name}
        </a>
      );
    };
  
    return (
      <nav
        className={`${borderBottom ? "border-b" : ""}`}
        style={{
          background: bgColor,
          borderColor: borderBottom ? borderColor : "transparent",
          padding: spacing.padding,
          margin: spacing.margin,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex ${
              direction == "rtl" ? "flex-row-reverse" : "flex-row"
            } justify-between items-center`}
          >
            <div className="flex-shrink-0">
              <a href="/">
                <img
                  src={logo}
                  alt="logo"
                  style={{ height: `${logoHeight}px` }}
                  className="object-contain"
                />
              </a>
            </div>
            <div
              className={`hidden sm:flex ${
                direction == "rtl" ? "flex-row-reverse" : "flex-row"
              } sm:items-center ${itemSpacing}`}
            >
              {links.map((link, idx) => (
                <NavLink key={idx} link={link} idx={idx} />
              ))}
            </div>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                style={{ color: fontColor }}
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
  
        <div
          className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link, idx) => (
              <NavLink key={idx} link={link} idx={idx} />
            ))}
          </div>
        </div>
      </nav>
    );
  }
}  