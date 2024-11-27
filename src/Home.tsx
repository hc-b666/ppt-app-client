import { useNavigate } from "react-router-dom";

export default function Home({
  handleCreatePresentation,
}: {
  handleCreatePresentation: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <button onClick={handleCreatePresentation}>Create presentation</button>
        <button onClick={() => navigate("/enter")}>
          Enter to existing presentation
        </button>
      </div>
    </div>
  );
}
