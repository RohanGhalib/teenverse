import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.teenverse.org"),
  title: "TEENVERSE — Pakistan's Teen Builders Network | Cool Nerds Doing Fun Things",
  description: "Teenverse is a community of energetic, playful, and talented Pakistani teens. We build civic solutions, host hackathons & MUNs, upskill members, and empower the next generation of builders.",
  keywords: ["Teenverse", "Teenverse Pakistan", "Teenagers Pakistan", "Hackathon", "Civic Volunteership", "Teen Coders", "Youth Empowerment Pakistan"],
  openGraph: {
    title: "TEENVERSE — Pakistan's Teen Builders Network",
    description: "A high-energy community of cool nerds building civic tech, hosting bootcamps, MUNs, and hackathons.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-screen bg-[#082D19] text-[#F0FFF4] antialiased selection:bg-[#CCFF00] selection:text-[#042113]">
        {children}
      </body>
    </html>
  );
}

