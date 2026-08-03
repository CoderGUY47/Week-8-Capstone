import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Oxie - AI Assistant",
  description:
    "A streaming AI assistant for developers and creators. Ask anything about code, real-time news, technology, and engineering.",
  keywords: ["AI", "Oxie", "assistant", "developer tools", "real-time AI", "streaming chat"],
  icons: {
    icon: "/images/oxie.png",
  },
  openGraph: {
    title: "Oxie — AI Assistant for Developers",
    description: "A high-performance streaming AI assistant. Ask about code, architecture, real-time news, and more.",
    type: "website",
    siteName: "Oxie AI",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full dark", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#0b0d10" />
      </head>
      <body className="min-h-full h-full bg-[#0b0d10] text-slate-100 antialiased">
        {/* Skip to main content — WCAG 2.1 AA */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
