export function TrustedByStrip() {
  const names = ["Northwind", "Globex", "Umbrella", "Stark", "Wayne"];
  return (
    <div className="border-y border-border/60 bg-muted/20 py-10">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Trusted by teams shipping</p>
      <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-4 opacity-70 grayscale">
        {names.map((n) => (
          <div
            key={n}
            className="flex h-9 min-w-[5.5rem] items-center justify-center rounded-md border border-border bg-background/60 px-3 text-[10px] font-semibold tracking-tight text-foreground"
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
