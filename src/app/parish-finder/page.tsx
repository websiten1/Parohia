import { ParishFinderClient } from "./ParishFinderClient";

export default function ParishFinderPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1">
        <ParishFinderClient />
      </main>
    </div>
  );
}
