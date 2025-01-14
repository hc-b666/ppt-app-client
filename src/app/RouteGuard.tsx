import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "./store";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const nickname = useAppSelector((state) => state.user.nickname);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!nickname && pathname !== "/nickname") {
      navigate("/nickname");
    }
  }, [nickname, pathname]);
  
  if (!nickname && pathname !== "/nickname") {
    return null;
  }

  return children;
}
