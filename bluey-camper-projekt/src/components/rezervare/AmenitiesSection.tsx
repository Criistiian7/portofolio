import { AmenityGroupCard } from "@/components/amenities/AmenityGroupCard";
import { AMENITY_GROUPS } from "@/data/booking";

export function AmenitiesSection() {
  return (
    <section
      id="dotari"
      className="scroll-mt-24 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      aria-labelledby="dotari-heading"
    >
      <h2
        id="dotari-heading"
        className="font-display text-3xl font-bold text-navy"
      >
        Dotări incluse
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Tot ce ai nevoie pentru confort pe drum — fără costuri suplimentare la
        dotările listate mai jos.
      </p>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {AMENITY_GROUPS.map((group, index) => (
          <AmenityGroupCard
            key={group.id}
            group={group}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
