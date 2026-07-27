import { useEffect } from "react";

/**
 * Custom hook to dynamically update document title and description meta tags.
 * @param {string} title - The title of the page.
 * @param {string} description - The meta description of the page.
 */
export default function useDocumentMetadata(title, description) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", description);
        document.head.appendChild(metaDesc);
      }
    }
  }, [title, description]);
}
