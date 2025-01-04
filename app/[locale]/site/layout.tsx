"use client";

import { ThemeProvider } from "next-themes";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <main className="bg-white text-black">
        {children}
      </main>
    </ThemeProvider>
  );
}
