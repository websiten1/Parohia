"use client";

import { useRouter } from "next/navigation";
import { ParishSelector } from "@/components/ParishSelector";
import { useSelectedParishId } from "@/lib/storage";

export default function OnboardingParishPage() {
  const router = useRouter();
  const [, setSelectedParishId] = useSelectedParishId();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ParishSelector
        onChoose={(id) => {
          setSelectedParishId(id);
          router.replace("/today");
        }}
      />
    </div>
  );
}
