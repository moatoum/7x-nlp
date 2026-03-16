import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "7X - National Logistics Support Platform",
  description:
    "A single national access point for logistics support across the 7X ecosystem, guiding every request to the right team.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "7X - National Logistics Support Platform",
    description:
      "A single national access point for logistics support across the 7X ecosystem, guiding every request to the right team.",
    siteName: "7X NLS",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "7X Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "7X - National Logistics Support Platform",
    description:
      "A single national access point for logistics support across the 7X ecosystem, guiding every request to the right team.",
    images: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${ibmPlexArabic.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
