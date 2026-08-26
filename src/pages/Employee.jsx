import useDocumentMetadata from "../hooks/useDocumentMetadata";

export default function EmployeeRedirect() {
  useDocumentMetadata(
    "Employee Portal | ArthoVista",
    "Internal portal for ArthoVista employees."
  );

  return null;
}