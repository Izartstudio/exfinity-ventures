import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { defaultDescription, siteName, siteUrl, socialImage } from "@/lib/seo";

const sharpGrotesk = localFont({
  variable: "--font-sharp-grotesk",
  display: "swap",
  src: "./fonts/SharpGrotesk-Book20.woff2",
});

const sharpGroteskCta = localFont({
  variable: "--font-sharp-grotesk-cta",
  display: "swap",
  src: "./fonts/SharpGrotesk-Medium20.woff2",
});

const interDisplayNav = localFont({
  variable: "--font-inter-display-nav",
  display: "swap",
  src: "./fonts/InterDisplay-Medium.woff2",
});

const interDisplayRegular = localFont({
  variable: "--font-inter-display-regular",
  display: "swap",
  src: "./fonts/InterDisplay-Regular.woff2",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "Exfinity Venture Partners",
    "venture capital India",
    "DeepTech investors",
    "AI venture capital",
    "B2B technology investors",
    "early stage venture capital",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  icons: {
    icon: [
      { url: "/favicon-dark.svg", type: "image/svg+xml", sizes: "64x64", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-light.svg", type: "image/svg+xml", sizes: "64x64", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-thumbnail.svg", type: "image/svg+xml", sizes: "256x256", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-thumbnail-dark.svg", type: "image/svg+xml", sizes: "256x256", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon-dark.svg",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "256x256" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: siteName,
    description: defaultDescription,
    url: "/",
    siteName,
    type: "website",
    locale: "en_IN",
    images: [{ url: socialImage, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/brand/exfinity-logo.svg`,
  foundingDate: "2014",
  email: "info@exfinityventures.com",
  telephone: "+91-80-6847-4100",
  sameAs: ["https://www.linkedin.com/company/exfinity-venture-partners"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "10, Museum Road, Shanthala Nagar, Ashok Nagar",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560001",
    addressCountry: "IN",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-IN",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sharpGrotesk.variable} ${sharpGroteskCta.variable} ${interDisplayNav.variable} ${interDisplayRegular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <SmoothScroll /><Navbar />{children}
        <Script id="enablestack-config" strategy="beforeInteractive">
          {`window.ENABLESTACK_CONFIG={colors:{primary:'#004de5'},icon:'default'};`}
        </Script>
        <Script
          id="enablestack-widget"
          src="https://cdn.jsdelivr.net/gh/EnableUser-Suryanshu/enablestack-widget@v2.1.0/enablestack-widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
