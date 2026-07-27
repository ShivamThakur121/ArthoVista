import { createContext, useContext, useState } from "react";

const ConsultationContext = createContext({
  isOpen: false,
  presetService: "",
  openConsultationModal: (service = "") => {},
  closeConsultationModal: () => {},
});

export function ConsultationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetService, setPresetService] = useState("");

  const openConsultationModal = (service = "") => {
    setPresetService(service);
    setIsOpen(true);
  };

  const closeConsultationModal = () => {
    setIsOpen(false);
    setPresetService("");
  };

  return (
    <ConsultationContext.Provider
      value={{
        isOpen,
        presetService,
        openConsultationModal,
        closeConsultationModal,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  return useContext(ConsultationContext);
}
