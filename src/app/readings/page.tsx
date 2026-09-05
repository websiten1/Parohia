"use client";

import Link from "next/link";
import { PhotoHero } from "@/components/PhotoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { getLiturgicalDay, READINGS, REFERENCE_DATE } from "@/lib/seedData";
import { PageContainer } from "@/components/ui/Surfaces";

export default function ReadingsPage() {
  const { t } = useTranslation();
  const day = getLiturgicalDay(REFERENCE_DATE)!;
  const epistle = READINGS.find((r) => r.id === day.epistle)!;
  const gospel = READINGS.find((r) => r.id === day.gospel)!;

  return (
    <PageContainer wash="cyan">
      <PhotoHero alt="Open Scripture" scrim="full" className="h-[300px] w-full shrink-0">
        <div className="absolute inset-x-0 bottom-0 px-outer pb-[26px] pt-[max(env(safe-area-inset-top),40px)]">
          <p className="font-serif text-[16px] text-white/70">{t("readings.todaysSmall")}</p>
          <h1 className="mt-[2px] font-serif text-[38px] font-bold leading-[1.05] text-white">{t("readings.readingsBig")}</h1>
        </div>
      </PhotoHero>

      <main className="flex-1 px-outer pt-[24px] pb-tabbar">
        <ReadingRow eyebrow={t("readings.epistle")} reference={epistle.reference} readingId={epistle.id} />
        <div className="my-[20px] h-px bg-divider" />
        <ReadingRow eyebrow={t("readings.gospel")} reference={gospel.reference} readingId={gospel.id} />
      </main>
    </PageContainer>
  );
}

function ReadingRow({ eyebrow, reference, readingId }: { eyebrow: string; reference: string; readingId: string }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-serif text-[22px] font-bold text-text">{eyebrow}</p>
      <p className="mt-[6px] font-serif text-[22px] font-bold leading-[1.2] text-text">{reference}</p>
      <p className="mt-[8px] font-sans text-[15.5px] text-navy">
        <Link href={`/reading/${readingId}`} className="press underline decoration-navy/25 underline-offset-4">
          {t("readings.read")}
        </Link>
        {" · "}
        <Link href={`/reading/${readingId}?mode=listen`} className="press underline decoration-navy/25 underline-offset-4">
          {t("readings.listen")}
        </Link>
      </p>
    </div>
  );
}
