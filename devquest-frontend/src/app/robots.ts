import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
   const baseUrl = "https://www.devquest.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, 
  }
}
