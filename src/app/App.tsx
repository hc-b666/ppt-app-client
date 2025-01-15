import Navbar from "@/common/components/core/Navbar";
import Router from "./Router";

export function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <Router />
    </div>
  );
}

