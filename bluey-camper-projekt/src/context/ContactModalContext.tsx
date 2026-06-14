import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ContactModal } from "@/components/ContactModal";
import type { ContactIntent } from "@/data/site";

type ContactModalContextValue = {
  openModal: (intent?: ContactIntent) => void;
  closeModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null,
);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<ContactIntent>("mission");

  const openModal = useCallback((nextIntent: ContactIntent = "mission") => {
    setIntent(nextIntent);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModal open={open} intent={intent} onClose={closeModal} />
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
