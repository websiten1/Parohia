"use client";

/**
 * Renders a supplied icon asset as a CSS mask rather than an <img>, so the
 * same file can be tinted per state — #8F8F8F inactive, #4D4D4D active for
 * navigation, white on the pastel category circles — without shipping a
 * separate copy of every glyph in every colour.
 */
export function AssetIcon({
  name,
  size,
  color,
  className,
}: {
  name: "home" | "calendar" | "messages" | "settings" | "youth" | "liturgy" | "study" | "dining";
  size: string;
  color: string;
  className?: string;
}) {
  const url = `url(/home/icons/${name}.png)`;
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
