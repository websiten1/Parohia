import { ParishFinderClient } from "./ParishFinderClient";
import { PageContainer } from "@/components/ui/Surfaces";

export default function ParishFinderPage() {
  return (
    <PageContainer>
      <main className="flex-1">
        <ParishFinderClient />
      </main>
    </PageContainer>
  );
}
