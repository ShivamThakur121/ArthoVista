import { useEffect } from "react";

/**
 * SEO metadata hook
 *
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {string} canonicalPath - Canonical path, e.g. "/about"
 * @param {string} image - Social sharing image URL
 */
export default function useDocumentMetadata(
  title,
  description,
  canonicalPath = "/",
  image = "https://www.arthovista.com/logo.png"
) {
  useEffect(() => {
    const siteUrl = "https://www.arthovista.com";

    // Make sure canonical path starts with /
    const normalizedPath = canonicalPath.startsWith("/")
      ? canonicalPath
      : `/${canonicalPath}`;

    const canonicalUrl =
      normalizedPath === "/"
        ? siteUrl
        : `${siteUrl}${normalizedPath}`;

    // -----------------------------------------
    // Document title
    // -----------------------------------------
    if (title) {
      document.title = title;
    }

    // -----------------------------------------
    // Helper function for meta tags
    // -----------------------------------------
    const setMetaTag = (attribute, key, content) => {
      if (!content) return;

      let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // -----------------------------------------
    // Meta description
    // -----------------------------------------
    setMetaTag("name", "description", description);

    // -----------------------------------------
    // Robots
    // -----------------------------------------
    setMetaTag(
      "name",
      "robots",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // -----------------------------------------
    // Open Graph
    // -----------------------------------------
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", "ArthoVista");
    setMetaTag("property", "og:image", image);

    // -----------------------------------------
    // Twitter / X
    // -----------------------------------------
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);

    // -----------------------------------------
    // Canonical URL
    // -----------------------------------------
    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);
  }, [title, description, canonicalPath, image]);
}