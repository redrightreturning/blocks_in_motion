import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GridsProvider } from "./helpers/gridsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Block Grid",
  description: "A 3D grid of clickable blocks using Three.js and React Three Fiber",
  icons: {
    icon: "/favicon.png", // path relative to the public folder
    apple: "/favicon.png" // optional, for iOS devices
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GridsProvider>
      <html lang="en">
        <body
          className={`${inter.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </GridsProvider>
  );
}
