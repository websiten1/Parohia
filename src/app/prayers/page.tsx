"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { PageBody, PageContainer } from "@/components/ui/Surfaces";
import { SECTIONS } from "@/lib/prayers";

/** The prayer book's contents. Each entry opens its own page. */
export default function PrayersPage() {
  return (
    <PageContainer>
      <header className="px-outer pt-[max(env(safe-area-inset-top),24px)]">
        <h1 className="font-serif text-[32px] font-bold leading-[1.1] text-text">Rugăciuni</h1>
      </header>

      <PageBody className="pt-[20px]">
        {SECTIONS.map((s) => (
          <Link key={s.id} href={`/prayers/${s.id}`} className="home-press block">
            <div className="flex min-h-[64px] items-center gap-[14px] py-[16px]">
              <span className="min-w-0 flex-1">
                <span className="block font-sans text-[16.5px] font-medium leading-[1.35] text-text">{s.title}</span>
                {s.pending ? (
                  <span className="mt-[3px] block font-sans text-[13.5px] text-muted">Text în așteptare</span>
                ) : s.kind === "sequence" ? (
                  <span className="mt-[3px] block font-sans text-[13.5px] text-muted">
                    {s.steps.length} rugăciuni
                  </span>
                ) : s.kind === "list" ? (
                  <span className="mt-[3px] block font-sans text-[13.5px] text-muted">
                    {s.steps.length} rugăciuni
                  </span>
                ) : null}
              </span>
              <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted/60" />
            </div>
          </Link>
        ))}
      </PageBody>
    </PageContainer>
  );
}
