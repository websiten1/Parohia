interface SealMarkProps {
  src?: string;
  size?: number;
  className?: string;
  /** The artwork is solid black line-art; on navy/dark surfaces it needs to render white. */
  tone?: "dark" | "light";
}

const DEFAULT_SEAL_SRC = "/brand/episcopate-seal-512.png";

/**
 * The official episcopate seal. The artwork's own silhouette (crown and
 * crossed staffs extend above the circular ribbon) is preserved via
 * transparency — it is not clipped into a circle, since that would cut off
 * the crown. The source file is black line-art; `tone="light"` renders it
 * white for navy surfaces via a CSS filter (the asset itself is untouched).
 */
export function SealMark({ src = DEFAULT_SEAL_SRC, size = 32, className, tone = "dark" }: SealMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Romanian Orthodox Episcopate of America seal"
      width={size}
      height={size}
      className={`${tone === "light" ? "invert" : ""} ${className ?? ""}`}
      style={{ width: size, height: "auto" }}
    />
  );
}
