import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bank Statement Converter | MT940 & CAMT.053 to CSV, XLSX, QBO",
  description:
    "Convert bank statements from MT940 and CAMT.053 formats to CSV, XLSX, and QuickBooks. Secure, fast, and trusted by accounting teams.",
  openGraph: {
    title: "Bank Statement Converter | MT940 & CAMT.053 to CSV, XLSX, QBO",
    description:
      "Convert bank statements from MT940 and CAMT.053 formats to CSV, XLSX, and QuickBooks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Auth0Provider user={undefined}>
          <Providers>{children}</Providers>
        </Auth0Provider>
      </body>
    </html>
  );
}
