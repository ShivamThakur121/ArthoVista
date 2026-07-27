import { useEffect } from "react";
import useDocumentMetadata from "../hooks/useDocumentMetadata";

export default function EmployeeRedirect() {
  useDocumentMetadata(
    "Employee Portal | Artha Ventures",
    "Internal portal for Artha Ventures employees."
  );
//   useEffect(() => {
//     window.location.href = "https://web.whatsapp.com/";
//   }, []);

  return null;
}