"use client";

import { useRouter } from "next/navigation";
import { ParishSelector } from "@/components/ParishSelector";
import { useSelectedParishId } from "@/lib/storage";
import { PageContainer } from "@/components/ui/Surfaces";

export default function ChangeParishPage() {
  const router = useRouter();
  const [, setSelectedParishId] = useSelectedParishId();

  return (
    <PageContainer>
      <ParishSelector
        onChoose={(id) => {
          setSelectedParishId(id);
          router.replace("/menu");
        }}
      />
    </PageContainer>
  );
}
