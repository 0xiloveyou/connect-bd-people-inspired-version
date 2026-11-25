import type { Metadata, Viewport } from "next";
import { Baloo_Da_2, Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

const baloo = Baloo_Da_2({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "প্রবাসে — সারা পৃথিবী থেকে এক সুতোয় দেশে",
    template: "%s · প্রবাসে",
  },
  description:
    "বাংলাদেশের প্রবাসীদের মানচিত্র। কোথায় থাকো, বাড়ি কোথায় — মিনিটে যোগ দাও, দূরত্ব দেখো, জেলার গল্প আর র‍্যাংকিংয়ে যুক্ত হও।",
  keywords: [
    "প্রবাসে",
    "বাংলাদেশি প্রবাসী",
    "প্রবাসীদের মানচিত্র",
    "বাংলাদেশ diaspora",
    "connect bd people",
    "probash",
  ],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "প্রবাসে",
    title: "প্রবাসে — সারা পৃথিবী থেকে এক সুতোয় দেশে",
    description:
      "প্রবাসে বাংলাদেশের মানুষের মানচিত্র, গল্প আর শিকড়ের ঠিকানা।",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "প্রবাসে — সারা পৃথিবী থেকে এক সুতোয় দেশে",
    description:
      "প্রবাসে বাংলাদেশের মানুষের মানচিত্র, গল্প আর শিকড়ের ঠিকানা।",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2b22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bn"
      className={`${hind.variable} ${baloo.variable} ${inter.variable}`}
    >
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
