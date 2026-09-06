"use client";

import Link from "next/link";
import { useState } from "react";
import { BellGlyph, SearchGlyph, SearchSparkle } from "@/components/home/HomeIcons";
import { AssetIcon } from "@/components/home/AssetIcon";
import { HomeNav } from "@/components/home/HomeNav";

/*
 * Home screen, built against the 850 × 1850 reference coordinate system.
 *
 * `--u` is one reference pixel expressed as a real length: the frame width
 * divided by 850. Every x / y / w / h / radius / font-size / gap below is the
 * reference number multiplied by it, which is exactly the scaling rule the
 * spec sets out (S = targetWidth / 850). Nothing here is eyeballed.
 */
const REF_W = 850;
const REF_H = 1850;

/** reference px -> CSS length */
const u = (n: number) => `calc(${n} * var(--u))`;

const COLORS = {
  bg: "#F9F6F4",
  surface: "#FBF9F7",
  textPrimary: "#1F1F20",
  textSecondary: "#8B8B8B",
  iconMuted: "#8E8E8E",
  iconActive: "#4D4D4D",
  accentRed: "#AB1F21",
  accentRedDark: "#7E1719",
  youth: "#A5D2FB",
  liturgy: "#FDE1AB",
  study: "#F5C1C5",
  dining: "#BED1B4",
};

const SURFACE_SHADOW = "0 12px 32px rgba(80,65,50,0.06)";
const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

const CATEGORIES = [
  { id: "youth", label: "Youth", cx: 147, fill: COLORS.youth, icon: "youth" as const, href: "/events" },
  { id: "liturgy", label: "Liturgy", cx: 326, fill: COLORS.liturgy, icon: "liturgy" as const, href: "/program-liturgic" },
  { id: "study", label: "Study", cx: 505, fill: COLORS.study, icon: "study" as const, href: "/readings" },
  { id: "dining", label: "Dining", cx: 684, fill: COLORS.dining, icon: "dining" as const, href: "/events" },
];

export default function HomePage() {
  const [page, setPage] = useState(0);

  return (
    <div
      style={
        {
          "--u": `calc(min(100vw, 402px) / ${REF_W})`,
          width: "100%",
          height: u(REF_H),
          position: "relative",
          overflow: "hidden",
          background: COLORS.bg,
          color: COLORS.textPrimary,
          fontFamily: FONT,
        } as React.CSSProperties
      }
    >
      {/* ---------------- Hero: 0,0,850,760 ---------------- */}
      <div style={{ position: "absolute", left: 0, top: 0, width: u(850), height: u(760), overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/hero-mosaic.jpg"
          alt=""
          aria-hidden="true"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "14% center" }}
        />
        {/* Warm white veil, opaque at left -> transparent at right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(249,246,244,0.96) 0%, rgba(249,246,244,0.62) 35%, rgba(249,246,244,0.08) 70%, rgba(249,246,244,0.00) 100%)",
          }}
        />
        {/*
          Top fade. §2 requires the veil to exist "so UI text remains readable",
          and the supplied mosaic at full saturation sits at almost exactly the
          luminance of the #7E7E7E location text — measured 1.0:1, which no
          left-to-right veil strength fixes. This is an overlay, not a repaint
          of the mosaic (§8), and it reproduces the pale header ground the
          reference image itself shows.
        */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(249,246,244,0.94) 0%, rgba(249,246,244,0.82) 12%, rgba(249,246,244,0.30) 24%, rgba(249,246,244,0.00) 34%)",
          }}
        />
        {/* Bottom fade into the page background — no hard boundary line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(249,246,244,0) 72%, rgba(249,246,244,0.95) 100%)",
          }}
        />
      </div>

      {/* ---------------- Parish title: 177,113,478,38 ---------------- */}
      <div
        style={{
          position: "absolute",
          left: u(177),
          top: u(113),
          width: u(478),
          textAlign: "center",
          fontWeight: 700,
          fontSize: u(30),
          lineHeight: u(35),
          letterSpacing: u(0.2),
          textTransform: "uppercase",
          color: "#111111",
        }}
      >
        Parohia Ortodoxă Română
      </div>

      {/* ---------------- Location: centered, top 157 ---------------- */}
      <div
        style={{
          position: "absolute",
          left: u(225),
          top: u(157),
          width: u(400),
          textAlign: "center",
          fontWeight: 500,
          fontSize: u(21),
          letterSpacing: u(2.3),
          color: "#7E7E7E",
        }}
      >
        DALLAS, TEXAS
      </div>

      {/* ---------------- Notification bubble: 709,117,78,78 ---------------- */}
      <Link
        href="/notifications"
        aria-label="Notifications"
        style={{
          position: "absolute",
          left: u(709),
          top: u(117),
          width: u(78),
          height: u(78),
          borderRadius: "50%",
          background: COLORS.surface,
          boxShadow: SURFACE_SHADOW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BellGlyph style={{ width: u(38), height: u(38), color: "#2A2A2A" }} />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: u(9),
            right: u(9),
            width: u(11),
            height: u(11),
            borderRadius: "50%",
            background: "#E0342F",
          }}
        />
      </Link>

      {/* ---------------- Hero pager: centered at y 692 ---------------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: u(692),
          width: u(850),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: u(13),
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Hero page ${i + 1}`}
            aria-current={page === i ? "true" : undefined}
            onClick={() => setPage(i)}
            style={{
              width: page === i ? u(47) : u(13.5),
              height: page === i ? u(14) : u(13.5),
              borderRadius: page === i ? u(7) : "50%",
              background: page === i ? "#F9F9F7" : "rgba(255,255,255,0.42)",
              transition: "width 260ms cubic-bezier(0.22,1,0.36,1), border-radius 260ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ))}
      </div>

      {/* ---------------- Search: outer 27,730,795,132 r66 ---------------- */}
      <div
        style={{
          position: "absolute",
          left: u(27),
          top: u(730),
          width: u(795),
          height: u(132),
          borderRadius: u(66),
          background: COLORS.accentRed,
        }}
      >
        {/* Inner cream field: 49,749,625,92 r46 (offsets are absolute on the grid) */}
        <button
          type="button"
          style={{
            position: "absolute",
            left: u(22),
            top: u(19),
            width: u(625),
            height: u(92),
            borderRadius: u(46),
            background: COLORS.surface,
            display: "flex",
            alignItems: "center",
            textAlign: "left",
          }}
        >
          <span style={{ position: "relative", marginLeft: u(29), display: "flex", alignItems: "center" }}>
            <SearchGlyph style={{ width: u(40), height: u(40), color: "#4A4A4A" }} />
            <SearchSparkle
              style={{ position: "absolute", left: u(26), top: u(-2), width: u(14), height: u(14), color: "#E8933A" }}
            />
          </span>
          <span style={{ marginLeft: u(27), fontSize: u(30), fontWeight: 400, color: "#858585" }}>
            Search with Orthodox Search
          </span>
        </button>

        {/* Right action circle: 691,749,94,94 */}
        <button
          type="button"
          aria-label="Saints of the day"
          style={{
            position: "absolute",
            left: u(664),
            top: u(19),
            width: u(94),
            height: u(94),
            borderRadius: "50%",
            background: COLORS.accentRedDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/home/orthodox-symbol.jpg"
            alt=""
            aria-hidden="true"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </button>
      </div>

      {/* ---------------- Stay Updated: 44,894 ---------------- */}
      <h2
        style={{
          position: "absolute",
          left: u(44),
          top: u(894),
          margin: 0,
          fontWeight: 700,
          fontSize: u(39),
          lineHeight: u(46),
          color: "#111111",
        }}
      >
        Stay Updated
      </h2>

      {/* ---------------- Upcoming Events card: 32,951,772,351 r42 ---------------- */}
      <section
        style={{
          position: "absolute",
          left: u(32),
          top: u(951),
          width: u(772),
          height: u(351),
          borderRadius: u(42),
          background: COLORS.surface,
          boxShadow: SURFACE_SHADOW,
        }}
      >
        <h3
          style={{
            position: "absolute",
            left: u(38),
            top: u(38),
            margin: 0,
            fontWeight: 700,
            fontSize: u(32),
            color: "#111111",
          }}
        >
          Upcoming Events
        </h3>
        <p
          style={{
            position: "absolute",
            left: u(40),
            top: u(91),
            margin: 0,
            fontSize: u(26.5),
            color: "#929292",
          }}
        >
          None upcoming
        </p>

        {CATEGORIES.map(({ id, label, cx, fill, icon, href }) => (
          <Link
            key={id}
            href={href}
            className="home-press"
            style={{
              position: "absolute",
              left: `calc(${cx - 32} * var(--u) - ${u(62)})`,
              top: u(143),
              width: u(124),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: u(124),
                height: u(124),
                borderRadius: "50%",
                background: fill,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssetIcon name={icon} size={u(62)} color="#FFFFFF" />
            </span>
            <span style={{ marginTop: u(16), fontSize: u(23), fontWeight: 500, color: "#444444" }}>{label}</span>
          </Link>
        ))}
      </section>

      {/* ---------------- Resources: 43,1344 ---------------- */}
      <h2
        style={{
          position: "absolute",
          left: u(43),
          top: u(1344),
          margin: 0,
          fontWeight: 700,
          fontSize: u(39),
          lineHeight: u(46),
          color: "#111111",
        }}
      >
        Resources
      </h2>

      {/* ---------------- Prayers tile: 40,1400,369,143 r32 ---------------- */}
      <ResourceTile
        href="/prayers"
        left={40}
        width={369}
        thumb="/home/thumb-prayers.jpg"
        thumbLeft={18}
        label="Prayers"
        labelLeft={136}
      />

      {/* ---------------- Contact tile: 424,1400,368,143 r32 ---------------- */}
      <ResourceTile
        href="/menu/support"
        left={424}
        width={368}
        thumb="/home/thumb-contact.jpg"
        thumbLeft={19}
        label="Contact"
        labelLeft={135}
      />

      <HomeNav absolute />
    </div>
  );
}

function ResourceTile({
  href,
  left,
  width,
  thumb,
  thumbLeft,
  label,
  labelLeft,
}: {
  href: string;
  left: number;
  width: number;
  thumb: string;
  thumbLeft: number;
  label: string;
  labelLeft: number;
}) {
  return (
    <Link
      href={href}
      className="home-press"
      style={{
        position: "absolute",
        left: u(left),
        top: u(1400),
        width: u(width),
        height: u(143),
        borderRadius: u(32),
        background: COLORS.surface,
        boxShadow: SURFACE_SHADOW,
        display: "block",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: u(thumbLeft),
          top: u(24),
          width: u(101),
          height: u(101),
          borderRadius: u(22),
          objectFit: "cover",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: u(labelLeft),
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: u(27.5),
          fontWeight: 500,
          color: "#111111",
        }}
      >
        {label}
      </span>
    </Link>
  );
}
