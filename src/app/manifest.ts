import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Romanian Orthodox Episcopate of America",
    short_name: "ROEA",
    description: "Daily readings, calendar, prayers, fasting rules, resources and parish directory.",
    start_url: "/today",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#071a33",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
