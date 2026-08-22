interface PhotoHeroProps {
  src?: string;
  alt: string;
  className?: string;
  /** Darkens toward the bottom so overlaid white text stays legible. */
  scrim?: "none" | "bottom" | "full";
  children?: React.ReactNode;
}

const SCRIM: Record<NonNullable<PhotoHeroProps["scrim"]>, string> = {
  none: "",
  bottom: "bg-gradient-to-t from-navy/80 via-navy/15 to-transparent",
  full: "bg-navy/55",
};

/**
 * Slot for the real editorial/liturgical photography the spec calls for
 * (church exteriors, icons, still life, community photos). No photo assets
 * are available in this build, so it falls back to the shared navy-texture
 * surface — never a hand-drawn illustration — until a real `src` is supplied.
 */
export function PhotoHero({ src, alt, className, scrim = "bottom", children }: PhotoHeroProps) {
  return (
    <div
      className={`relative overflow-hidden ${src ? "bg-navy-2" : "bg-navy-texture"} ${className ?? ""}`}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      )}
      {scrim !== "none" && <div className={`absolute inset-0 ${SCRIM[scrim]}`} aria-hidden="true" />}
      {children}
    </div>
  );
}
