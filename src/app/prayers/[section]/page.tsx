"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppHeader } from "@/components/AppHeader";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";
import { PageBody, PageContainer } from "@/components/ui/Surfaces";
import { getSection, type PrayerStep } from "@/lib/prayers";

export default function PrayerSectionPage() {
  const { section } = useParams<{ section: string }>();
  const data = getSection(section);
  if (!data) return notFound();

  if (data.pending) return <PendingSection title={data.title} />;
  if (data.kind === "sequence") return <Sequence title={data.title} steps={data.steps} />;
  if (data.kind === "list") return <ListSection title={data.title} intro={data.intro} steps={data.steps} />;
  return <SinglePage title={data.title} intro={data.intro} steps={data.steps} />;
}

/* ---------- Stepped reading: one prayer per screen, arrow to the next ---------- */

function Sequence({ title, steps }: { title: string; steps: PrayerStep[] }) {
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = steps[i];
  const atStart = i === 0;
  const atEnd = i === steps.length - 1;

  return (
    <PageContainer tone="reading">
      <AppHeader title={title} backHref="/prayers" />

      {/* Position within the section, so it is clear you are still inside it. */}
      <p className="px-outer font-sans text-[13px] text-muted">
        {i + 1} din {steps.length}
      </p>

      <PageBody className="pt-[10px]">
        <AnimatePresence mode="wait">
          <motion.article
            key={step.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -14 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <PrayerBody step={step} />
          </motion.article>
        </AnimatePresence>
      </PageBody>

      {/* The arrow stays on the right and never leaves the section. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[402px]">
        <div className="pointer-events-auto flex items-center justify-between px-outer pb-[calc(env(safe-area-inset-bottom,0px)+220px)]">
          <StepArrow
            side="prev"
            disabled={atStart}
            onClick={() => setI((n) => Math.max(0, n - 1))}
            label="Rugăciunea anterioară"
          />
          <StepArrow
            side="next"
            disabled={atEnd}
            onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}
            label="Rugăciunea următoare"
          />
        </div>
      </div>
    </PageContainer>
  );
}

function StepArrow({
  side,
  disabled,
  onClick,
  label,
}: {
  side: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`home-press flex h-[54px] w-[54px] items-center justify-center rounded-full bg-surface elev-subtle transition-opacity ${
        disabled ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {side === "prev" ? (
        <ChevronLeftIcon className="h-[20px] w-[20px] text-text" />
      ) : (
        <ChevronRightIcon className="h-[20px] w-[20px] text-text" />
      )}
    </button>
  );
}

/* ---------- Index that opens each prayer in a sheet ---------- */

function ListSection({ title, intro, steps }: { title: string; intro?: string; steps: PrayerStep[] }) {
  const [open, setOpen] = useState<PrayerStep | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <PageContainer tone="reading">
      <AppHeader title={title} backHref="/prayers" />
      <PageBody className="pt-[6px]">
        {intro && <p className="font-serif text-[16px] italic leading-[1.55] text-muted">{intro}</p>}
        <div className="mt-[18px]">
          {steps.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpen(s)}
              className="home-press flex w-full min-h-[62px] items-center gap-[14px] py-[15px] text-left"
            >
              <span className="min-w-0 flex-1 font-sans text-[16.5px] font-medium leading-[1.35] text-text">
                {s.title}
              </span>
              <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted/60" />
            </button>
          ))}
        </div>
      </PageBody>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[rgba(20,18,17,0.34)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setOpen(null)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={open.title}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[86dvh] max-w-[402px] overflow-y-auto rounded-t-sheet bg-background-reading px-outer pb-[40px] pt-[10px]"
              initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "spring", duration: 0.44, bounce: 0.02 }}
            >
              <div className="sticky top-0 flex justify-end bg-background-reading pb-[6px] pt-[6px]">
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Închide"
                  className="home-press flex h-[44px] w-[44px] items-center justify-center rounded-full bg-surface-soft text-text"
                >
                  <CloseIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
              <PrayerBody step={open} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

/* ---------- One continuous reading ---------- */

function SinglePage({ title, intro, steps }: { title: string; intro?: string; steps: PrayerStep[] }) {
  return (
    <PageContainer tone="reading">
      <AppHeader title={title} backHref="/prayers" />
      <PageBody className="pt-[6px]">
        {intro && <p className="font-serif text-[16px] italic leading-[1.55] text-muted">{intro}</p>}
        <div className={intro ? "mt-[26px]" : ""}>
          {steps.map((s, i) => (
            <div key={s.id} className={i ? "mt-[34px]" : ""}>
              <PrayerBody step={s} />
            </div>
          ))}
        </div>
      </PageBody>
    </PageContainer>
  );
}

function PendingSection({ title }: { title: string }) {
  return (
    <PageContainer tone="reading">
      <AppHeader title={title} backHref="/prayers" />
      <PageBody className="pt-[40px]">
        <p className="font-serif text-[17px] leading-[1.6] text-muted">
          Textul acestei rânduieli nu a fost încă adăugat.
        </p>
      </PageBody>
    </PageContainer>
  );
}

/** Renders a prayer exactly as supplied: rubric, paragraphs, closing note. */
function PrayerBody({ step }: { step: PrayerStep }) {
  return (
    <>
      <h2 className="font-serif text-[24px] font-bold leading-[1.25] text-text">{step.title}</h2>
      {step.rubric && (
        <p className="mt-[12px] font-serif text-[15.5px] italic leading-[1.55] text-muted">{step.rubric}</p>
      )}
      <div className="mt-[20px]">
        {step.paragraphs.map((p, i) => (
          <p key={i} className="mb-[18px] font-serif text-[18px] leading-[1.62] text-text last:mb-0">
            {p}
          </p>
        ))}
      </div>
      {step.note && (
        <p className="mt-[22px] font-serif text-[15.5px] italic leading-[1.6] text-muted">{step.note}</p>
      )}
    </>
  );
}
