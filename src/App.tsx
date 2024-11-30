import { useState, useEffect } from "react";
import socket from "./socket";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import EnterPptId from "./EnterPptId";
import NicknamePrompt from "./NicknamePrompt";
import Ppt from "./Ppt";

export default function App() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");

    if (!storedNickname) {
      navigate("/nickname");
    }

    if (storedNickname) {
      setNickname(storedNickname);
      socket.on("connect", () => {
        console.log("connected");
      });
    }
  }, [navigate]);

  useEffect(() => {
    const storedPptId = localStorage.getItem("pptId");

    if (!storedPptId) {
      navigate("/");
    }

    if (storedPptId) {
      navigate("/ppt");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/nickname"
          element={
            <NicknamePrompt nickname={nickname} setNickname={setNickname} />
          }
        />
        <Route path="/" element={<Home nickname={nickname} />} />
        <Route path="/enter" element={<EnterPptId />} />
        <Route path="/ppt" element={<Ppt />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

