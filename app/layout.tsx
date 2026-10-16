import type { Metadata } from "next";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Kumo",
  description:
    "Digital solutions for real-world business challenges from KUMO Tech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${robotoMono.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
