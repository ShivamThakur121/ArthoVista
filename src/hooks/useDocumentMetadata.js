import { useEffect } from "react";

export default function useDocumentMetadata(
  title,
  description,
  options = {}
) {
  useEffect(() => {
    const siteUrl = "https://www.arthovista.com";

    // Current URL path
    const currentPath = window.location.pathname;

    // Create canonical URL
    const canonicalUrl =
      options.canonical ||
      (currentPath === "/"
        ? siteUrl
        : `${siteUrl}${currentPath.replace(/\/+$/, "")}`);

    // Default social sharing image
    const image = options.image || `${siteUrl}/logo.png`;

    // Default robots instruction
    const robots =
      options.robots ||
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    // Open Graph type
    const type = options.type || "website";

    // -----------------------------
    // Page title
    // -----------------------------
    if (title) {
      document.title = title;
    }

    // -----------------------------
    // Helper function
    // -----------------------------
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

    // -----------------------------
    // Meta description
    // -----------------------------
    setMetaTag("name", "description", description);

    // -----------------------------
    // Robots
    // -----------------------------
    setMetaTag("name", "robots", robots);

    // -----------------------------
    // Open Graph
    // -----------------------------
    setMetaTag("property", "og:title", title);

    setMetaTag(
      "property",
      "og:description",
      description
    );

    setMetaTag(
      "property",
      "og:url",
      canonicalUrl
    );

    setMetaTag(
      "property",
      "og:type",
      type
    );

    setMetaTag(
      "property",
      "og:site_name",
      "ArthoVista"
    );

    setMetaTag(
      "property",
      "og:image",
      image
    );

    // -----------------------------
    // Twitter / X
    // -----------------------------
    setMetaTag(
      "name",
      "twitter:card",
      "summary_large_image"
    );

    setMetaTag(
      "name",
      "twitter:title",
      title
    );

    setMetaTag(
      "name",
      "twitter:description",
      description
    );

    setMetaTag(
      "name",
      "twitter:image",
      image
    );

    // -----------------------------
    // Canonical URL
    // -----------------------------
    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");

      canonical.setAttribute(
        "rel",
        "canonical"
      );

      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      canonicalUrl
    );
  }, [
    title,
    description,
    options.canonical,
    options.image,
    options.robots,
    options.type,
  ]);
}