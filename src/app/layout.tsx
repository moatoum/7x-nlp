import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "LINK — by 7X",
  description:
    "LINK is 7X's single national access point — connecting every logistics request to the right team, solution, and partner across the ecosystem.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "LINK — by 7X",
    description:
      "LINK is 7X's single national access point — connecting every logistics request to the right team, solution, and partner across the ecosystem.",
    siteName: "LINK by 7X",
    type: "website",
    images: [
      {
        url: "/graphthumb.png",
        width: 1200,
        height: 630,
        alt: "LINK by 7X",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LINK — by 7X",
    description:
      "LINK is 7X's single national access point — connecting every logistics request to the right team, solution, and partner across the ecosystem.",
    images: ["/graphthumb.png"],
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
