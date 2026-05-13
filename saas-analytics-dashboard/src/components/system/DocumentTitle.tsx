import { useLayoutEffect } from "react";

/** Sets `document.title` for the route; restores previous title on unmount. */
export function DocumentTitle({ title }: { title: string }) {
  useLayoutEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
  return null;
}
