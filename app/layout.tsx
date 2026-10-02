import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

const sharpGrotesk = localFont({
  variable: "--font-sharp-grotesk",
  display: "swap",
  src: "./fonts/SharpGrotesk-Book20.otf",
});

const sharpGroteskCta = localFont({
  variable: "--font-sharp-grotesk-cta",
  display: "swap",
  src: "./fonts/SharpGrotesk-Medium20.otf",
});

const interDisplayNav = localFont({
  variable: "--font-inter-display-nav",
  display: "swap",
  src: "./fonts/InterDisplay-Medium.ttf",
});

const interDisplayRegular = localFont({
  variable: "--font-inter-display-regular",
  display: "swap",
  src: "./fonts/InterDisplay-Regular.ttf",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://exfinityventures.com"),
  title: "Exfinity Venture Partners",
  description:
    "Backing global innovation across DeepTech, AI-native software and B2B platforms.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Exfinity Venture Partners",
    description:
      "Backing global innovation across DeepTech, AI-native software and B2B platforms.",
    url: "/",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sharpGrotesk.variable} ${sharpGroteskCta.variable} ${interDisplayNav.variable} ${interDisplayRegular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><SmoothScroll />{children}</body>
    </html>
  );
}
