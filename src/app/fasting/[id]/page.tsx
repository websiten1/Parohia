"use client";

import { notFound, useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { FASTS, formatMediumDate } from "@/lib/seedData";
import { PageContainer } from "@/components/ui/Surfaces";

export default function FastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
  const fast = FASTS.find((f) => f.id === id);
  if (!fast) return notFound();

  const title = language === "ro" ? (fast.titleRo ?? fast.title) : fast.title;
  const description = language === "ro" ? (fast.descriptionRo ?? fast.description) : fast.description;
  const permittedFoods = language === "ro" ? (fast.permittedFoodsRo ?? fast.permittedFoods) : fast.permittedFoods;
  const liturgicalContext =
    language === "ro" ? (fast.liturgicalContextRo ?? fast.liturgicalContext) : fast.liturgicalContext;

  return (
    <PageContainer wash="green">
      <AppHeader title={title} right={<BookmarkButton entityType="reading" entityId={fast.id} title={title} />} />

      <main className="flex-1 px-outer py-[22px]">
        <p className="font-sans text-[13px] font-semibold text-burgundy">
          {formatMediumDate(fast.startDate, language)} – {formatMediumDate(fast.endDate, language)}
        </p>
        <p className="mt-[14px] font-serif text-[17px] leading-[1.5] text-text">{description}</p>

        <p className="mt-[28px] font-serif text-[22px] font-bold text-text">
          {t("fastDetail.permittedFoods")}
        </p>
        <p className="mt-[8px] font-sans text-[15px] leading-[1.5] text-text">{permittedFoods}</p>

        <p className="mt-[28px] font-serif text-[22px] font-bold text-text">
          {t("fastDetail.liturgicalContext")}
        </p>
        <p className="mt-[8px] font-sans text-[15px] leading-[1.5] text-text">{liturgicalContext}</p>

        <p className="mt-[28px] font-sans text-[12px] italic text-muted">{t("fastDetail.disclaimer")}</p>
      </main>
    </PageContainer>
  );
}
