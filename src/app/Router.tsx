import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import RouteGuard from "./RouteGuard";

const Homepage = lazy(() => import("@/pages/home"));
const NicknamePage = lazy(() => import("@/pages/nickname"));
const RoomsPage = lazy(() => import("@/pages/rooms"));
const CreatePresentationPage = lazy(() => import("@/pages/create-ppt"));

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
                <Route path="/create" element={<CreatePresentationPage />} />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </RouteGuard>
          }
        />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Suspense>
  );
}
