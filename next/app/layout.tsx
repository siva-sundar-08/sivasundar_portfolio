import type { Metadata, Viewport } from "next";
import { Anybody, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/nav/Nav";
import { modeInitScript } from "@/components/providers/ModeProvider";
import { Providers } from "@/components/providers/Providers";
import { Cursor } from "@/components/ui/Cursor";
import { site } from "@/content/site";
import "@/styles/globals.css";

const display = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-anybody",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.socials[0].href }],
  keywords: [
    "iOS developer",
    "SwiftUI",
    "React",
    "web developer",
    "portfolio",
    site.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030309",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: new URL(site.portrait.src, site.url).toString(),
  jobTitle: site.roles.join(" & "),
  description: site.description,
  sameAs: site.socials.map((s) => s.href),
  knowsAbout: ["Swift", "SwiftUI", "iOS development", "React", "JavaScript", "Flutter"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeInitScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <Cursor />
          <Nav />
          {children}
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
