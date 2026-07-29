import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DrawingLayer from "@/components/DrawingLayer";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// `weight` is omitted so both styles load the full variable 100–900 range.
// Archivo's italic is a separate file, not an axis, hence the style array.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const fullName = `${site.firstName} ${site.lastName}`;

export const metadata: Metadata = {
  title: `${fullName} · ${site.role}`,
  description: site.summary,
};

/** Applies the stored theme before first paint so there's no flash. */
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="dot-grid flex min-h-dvh flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <DrawingLayer />
      </body>
    </html>
  );
}
