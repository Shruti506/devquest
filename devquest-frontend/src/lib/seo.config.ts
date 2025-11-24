// lib/seo.config.ts
import { Metadata } from "next";

const SITE_URL = "https://devquest-eosin.vercel.app";
const SITE_NAME = "DevQuest";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_SEO: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@DevQuest",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}