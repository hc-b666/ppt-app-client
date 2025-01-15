import PresentationsList from "@/features/ppt/PresentationsList";

export default function RoomsPage() {
  return (
    <main className="container flex-grow flex flex-col items-center gap-8 py-10">
      <PresentationsList />
    </main>
  );
}
