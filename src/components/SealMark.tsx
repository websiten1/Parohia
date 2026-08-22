interface SealMarkProps {
  src?: string;
  size?: number;
  className?: string;
  /** The artwork is solid black line-art; on navy/dark surfaces it needs to render white. */
  tone?: "dark" | "light";
}

const DEFAULT_SEAL_SRC = "/brand/parish-seal-512.png";

/**
 * The parish seal. The artwork's own silhouette extends above the circular
 * ribbon and is preserved via transparency — it is not clipped into a
 * circle, since that would cut off the crest. The source file is black
 * line-art; `tone="light"` renders it white for navy surfaces via a CSS
 * filter (the asset itself is untouched).
 *
 * NOTE: the current placeholder artwork depicts an episcopal crown and
 * crossed staffs — imagery specific to a bishop's see. Swap
 * public/brand/parish-seal-512.png for parish-neutral artwork.
 */
export function SealMark({ src = DEFAULT_SEAL_SRC, size = 32, className, tone = "dark" }: SealMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Parish seal"
      width={size}
      height={size}
      className={`${tone === "light" ? "invert" : ""} ${className ?? ""}`}
      style={{ width: size, height: "auto" }}
    />
  );
}
