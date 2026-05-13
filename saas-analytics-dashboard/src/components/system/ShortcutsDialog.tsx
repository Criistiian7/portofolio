import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/uiStore";
import { PRODUCT_NAME } from "@/brand/constants";

export function ShortcutsDialog() {
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const cur = useUiStore.getState().commandOpen;
        useUiStore.getState().setCommandOpen(!cur);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{PRODUCT_NAME} shortcuts</DialogTitle>
          <DialogDescription>Client-only palette—no command package required.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex justify-between gap-4">
            <span>Toggle this dialog</span>
            <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-foreground">⌘/Ctrl + K</kbd>
          </li>
          <li className="flex justify-between gap-4">
            <span>Skip to main content</span>
            <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-foreground">Tab</kbd>
          </li>
          <li className="flex justify-between gap-4">
            <span>Theme switcher</span>
            <span className="text-xs">Top bar → Appearance</span>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
