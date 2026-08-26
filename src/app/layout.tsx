import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.teenverse.org"),
  title: {
    default: "Teenverse — Pakistan's Teen Builders Network",
    template: "%s | Teenverse",
  },
  description: "A community of energetic teen builders, hackers, and creators in Pakistan building civic tech, hackathons, and creative projects.",
  keywords: ["Teenverse", "Pakistan Teen Builders", "Teen Hackathons", "Teen Coders Pakistan", "Youth Builders"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: ["/favicon.svg"],
  },
  openGraph: {
    title: "Teenverse — Pakistan's Teen Builders Network",
    description: "A community of energetic teen builders, hackers, and creators in Pakistan.",
    url: "https://www.teenverse.org",
    siteName: "Teenverse",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Teenverse Pakistan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teenverse — Pakistan's Teen Builders Network",
    description: "A community of energetic teen builders, hackers, and creators in Pakistan.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-[#082D19] text-[#F0FFF4] antialiased selection:bg-[#CCFF00] selection:text-[#042113]">
        {children}
      </body>
    </html>
  );
}
