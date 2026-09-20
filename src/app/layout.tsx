import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Помогайка DFZ — Умный AI-помощник для школьников",
  description:
    "Домашка стала проще. Отправь задание — получи понятное объяснение от сообщества и Помогайка AI на базе Google Gemini Vision.",
  keywords: [
    "Помогайка",
    "DFZ",
    "домашние задания",
    "ГДЗ",
    "решение задач",
    "школа",
    "математика",
    "алгебра",
    "геометрия",
    "физика",
    "Gemini Vision",
    "Telegram бот",
  ],
  authors: [{ name: "DFZ Team", url: "https://t.me/pomogaykaTeam" }],
  creator: "DFZ",
  publisher: "Помогайка DFZ",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pomogayka.dfz.team"),
  openGraph: {
    title: "Помогайка DFZ — Умный AI-помощник для школьников",
    description:
      "Домашка стала проще. Отправь задание — получи понятное объяснение от сообщества и Помогайка AI на базе Google Gemini Vision.",
    url: "/",
    siteName: "Помогайка DFZ",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Помогайка DFZ — AI-помощник по домашним заданиям",
    description: "Мгновенное и понятное решение домашних заданий с фото.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary-500 selection:text-white">
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
