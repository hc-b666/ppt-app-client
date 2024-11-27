import { useState, useEffect, useCallback } from "react";
import socket from "./socket";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import Presentation from "./Presentation";
import EnterPptId from "./EnterPptId";
import NicknamePrompt from "./NicknamePrompt";

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

  const handleCreatePresentation = () => {
    socket.emit("createPresentation", nickname);

    socket.on("presentationCreated", (res) => {
      if (res.success) {
        console.log("Presentation created successfully:", res.presentation);
        navigate(`/presentation/${res.presentation._id}`);
      } else {
        console.error("Error creating presentation:", res.error);
      }
    });
  };

  const handleEnterPresentation = (presentationId: string) => {
    socket.emit("joinPresentation", presentationId, nickname);

    socket.on("presentationJoined", (res) => {
      if (res.success) {
        console.log("Presentation joined successfully:", res.presentation);
        navigate(`/presentation/${res.presentation._id}`, {
          state: { presentation: res.presentation },
        });
      } else {
        console.error("Error joining presentation:", res.error);
      }
    });
  };

  const handleGetPresentation = useCallback(
    (presentationId: string) => {
      socket.emit("getPresentation", presentationId);

      socket.on("presentationJoined", (res) => {
        if (res.success) {
          console.log("Presentation joined successfully:", res.presentation);
          navigate(`/presentation/${res.presentation._id}`, {
            state: { presentation: res.presentation },
          });
        } else {
          console.error("Error joining presentation:", res.error);
        }
      });
    },
    [navigate]
  );

  const handleAddSlide = (presentationId: string) => {
    socket.emit("addSlide", presentationId);

    socket.on("slideAdded", (res) => {
      if (res.success) {
        console.log("Slide added successfully:", res.presentation);
        navigate(`/presentation/${res.presentation._id}`, {
          state: { presentation: res.presentation },
        });
      } else {
        console.error("Error adding slide:", res.error);
      }
    });
  };

  const handleAddObject = (
    presentationId: string,
    slideId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tool: string,
    roughElement: any
  ) => {
    socket.emit("addObject", presentationId, slideId, {
      x1,
      y1,
      x2,
      y2,
      tool,
      roughElement,
    });

    socket.on("objectAdded", (res) => {
      if (res.success) {
        console.log("Object added successfully:", res.presentation);
        navigate(`/presentation/${res.presentation._id}`, {
          state: { presentation: res.presentation },
        });
      } else {
        console.error("Error adding object:", res.error);
      }
    });
  };

  return (
    <>
      <Routes>
        <Route
          path="/nickname"
          element={
            <NicknamePrompt nickname={nickname} setNickname={setNickname} />
          }
        />
        <Route
          path="/"
          element={<Home handleCreatePresentation={handleCreatePresentation} />}
        />
        <Route
          path="/enter"
          element={
            <EnterPptId handleEnterPresentation={handleEnterPresentation} />
          }
        />
        <Route
          path="/presentation/:id"
          element={
            <Presentation
              handleGetPresentation={handleGetPresentation}
              handleAddSlide={handleAddSlide}
              handleAddObject={handleAddObject}
            />
          }
        />
      </Routes>
    </>
  );
}

