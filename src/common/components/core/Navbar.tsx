import Nickname from "@/features/user/Nickname";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="container py-5 flex items-center justify-between">
      <NavLink to="/" className="text-2xl fond-bold">
        PPT
      </NavLink>
      <div className="flex items-center gap-5">
        <NavLink to="/main/create">Create Presentation</NavLink>
        <Nickname />
      </div>
    </nav>
  );
}
