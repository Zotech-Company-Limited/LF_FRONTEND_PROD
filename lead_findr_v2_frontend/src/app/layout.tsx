import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleMapsProvider } from "@/components/molecules/google_maps_provider";
import UserNavbar from "@/components/organisms/user_navbar"; // NEW
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clarnyx",
  description: "Business visibility insights powered by AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleMapsProvider>
          <UserNavbar>{children}</UserNavbar>
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
