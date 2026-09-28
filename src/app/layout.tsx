import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { ViewedCounterProvider } from "@/context/viewed-counter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

// Karla is the typeface Splendor serves on splendordesign.com.
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splendor — Sandbox",
  description:
    "A Next.js sandbox built around Splendor, the Red Bank creative agency: branding, custom web design, digital marketing and content strategy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${karla.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ViewedCounterProvider>
          <Navbar />
          {children}
          <Footer />
        </ViewedCounterProvider>
      </body>
    </html>
  );
}
