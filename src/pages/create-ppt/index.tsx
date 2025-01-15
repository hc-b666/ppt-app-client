import CreatePresentationForm from "@/features/ppt/CreatePresentationForm";

export default function CreatePresentationPage() {
  return (
    <main className="container flex-grow flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold">Create your Presentation</h1>
      <CreatePresentationForm />
    </main>
  );
}
