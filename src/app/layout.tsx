import type { Metadata } from "next";
import { Righteous, Red_Rose } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const logo = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--logo-font",
  display: "swap",
});

const redRose = Red_Rose({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--rose-font",
  display: "swap",
});

// Iosevka Charon tidak tersedia sebagai font Google pada saat desain dibuat;
// berkas TTF disediakan lokal (SIL OFL) dan next/font akan menghasilkan woff2.
const about = localFont({
  src: [
    {
      path: "../fonts/iosevka-charon/IosevkaCharon-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/iosevka-charon/IosevkaCharon-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/iosevka-charon/IosevkaCharon-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--about-font",
  fallback: ["ui-monospace", "monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gimilog — Game Reviews & Backlog",
  description:
    "Write reviews, rate games, and track your game backlog.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${logo.variable} ${redRose.variable} ${about.variable}`}
    >
      <body>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
