import { Footer } from "@/components/features/landing/footer";
import { Header } from "@/components/features/landing/header";
import { QuickRail } from "@/components/layout/quick-rail";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Geist, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const departureMono = localFont({
  src: "../public/fonts/DepartureMono-Regular.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: t("app.title"),
    description: t("app.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} ${departureMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <QuickRail />
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
