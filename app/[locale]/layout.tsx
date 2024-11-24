import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "./styles.css";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ThemeProvider } from "./ThemeProvider";
import ClientProviders from "./ClientProviders";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Inter, Roboto, Lora, Playfair_Display, Source_Code_Pro, 
  Montserrat, Open_Sans, Merriweather, Fira_Code, Dancing_Script } from 'next/font/google'
  import { Analytics } from "@vercel/analytics/react"

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const sourceCode = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code',
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
})

export const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
})

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
})

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Combine all font variables
  const fontVariables = [
    inter.variable,
    roboto.variable,
    lora.variable,
    playfair.variable,
    sourceCode.variable,
    montserrat.variable,
    openSans.variable,
    merriweather.variable,
    firaCode.variable,
    dancingScript.variable
  ].join(' ');

  return (
    <html 
      lang={locale} 
      dir={dir} 
      suppressHydrationWarning
    >
      <body 
        className={`${fontVariables} ${inter.className}`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Suspense fallback={null}>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="light" 
              enableSystem
              disableTransitionOnChange
              storageKey="app-theme"
            >
              <ClientProviders>
                <TooltipProvider>
                  <main>
            
                    {children}
                  </main>
                  <Toaster />
                  <ConfettiProvider />
                </TooltipProvider>
              </ClientProviders>
            </ThemeProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
      <Analytics />
    </html>
  );
}