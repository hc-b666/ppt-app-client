import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import RouteGuard from "./RouteGuard";

const Homepage = lazy(() => import("@/pages/home"));
const NicknamePage = lazy(() => import("@/pages/nickname"));
const RoomsPage = lazy(() => import("@/pages/rooms"));

export default function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/nickname" element={<NicknamePage />} />

        <Route
          path="/main/*"
          element={
            <RouteGuard>
              <Routes>
                <Route path="/" element={<RoomsPage />} />
              </Routes>
            </RouteGuard>
          }
        />
      </Routes>
    </Suspense>
  );
}
