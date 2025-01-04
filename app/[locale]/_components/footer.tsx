import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { Facebook, Twitter, Instagram, Linkedin, Github, ExternalLink } from 'lucide-react'

const SocialIcon = ({ children, href }) => {
  return (
    <Link 
      href={href} 
      className="relative group will-change-transform"
    >
      <div className="transform transition-transform duration-200 ease-out group-hover:scale-110">
        {children}
      </div>
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-current transition-opacity duration-200" />
    </Link>
  )
}

const FooterLink = ({ href, children }) => (
  <Link 
    href={href} 
    className="relative group flex items-center gap-2 w-fit"
  >
    <span className="dark:text-gray-400 text-gray-600 group-hover:text-current transition-colors duration-200">
      {children}
    </span>
    <ExternalLink 
      size={14} 
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-200" />
  </Link>
)

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950 text-gray-900 dark:text-white py-16 overflow-hidden">
      {/* Subtle gradient overlays - optimized for both modes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,0,255,0.03),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_-20%,rgba(120,0,255,0.07),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(70,0,255,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(70,0,255,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Crax
            </h3>
            <p className="dark:text-gray-400 text-gray-600 text-lg">
              Build stunning websites with the power of AI
            </p>
            <div className="flex space-x-6">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" }
              ].map((social, i) => (
                <SocialIcon key={i} href={social.href}>
                  <social.icon 
                    size={24} 
                    className="dark:text-gray-400 text-gray-600 group-hover:text-current transition-colors duration-200" 
                  />
                </SocialIcon>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Templates", "Integrations", "Pricing", "FAQ"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Press", "Partners"]
            },
            {
              title: "Support",
              links: ["Help Center", "Documentation", "Community", "Status", "Contact Us"]
            }
          ].map((section, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-lg font-semibold tracking-wide uppercase dark:text-gray-300 text-gray-700">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <FooterLink href="#">{link}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t dark:border-gray-800/50 border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="dark:text-gray-400 text-gray-600">
              &copy; {new Date().getFullYear()} Crax. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((text, i) => (
                <FooterLink key={i} href="#">{text}</FooterLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}