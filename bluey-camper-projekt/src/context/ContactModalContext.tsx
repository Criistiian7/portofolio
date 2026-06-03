import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ContactModal } from "@/components/ContactModal";

type ContactModalContextValue = {
  openModal: () => void;
  closeModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null,
);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModal open={open} onClose={closeModal} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal(): ContactModalContextValue {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}
