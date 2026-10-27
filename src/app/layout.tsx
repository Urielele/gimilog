import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gimilog — Game Reviews & Backlog",
  description:
    "Write reviews, rate games, and track your game backlog.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
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
