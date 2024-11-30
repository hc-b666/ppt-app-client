import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { useEffect } from "react";

export default function Home({nickname}: {nickname: string}) {
  const navigate = useNavigate();

  useEffect(() => {
  
  }, []);

  const createPpt = () => {
    socket.emit("createPresentation", nickname);

    socket.on("presentationCreated", (res) => {
      if (res.success) {
        console.log("Presentation created successfully:", res.presentation);
        console.log(res);
        localStorage.setItem("pptId", res.presentation._id);
        navigate("/ppt");
      } else {
        console.error("Error creating presentation:", res.error);
      }
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex items-center gap-3">
        <button onClick={createPpt}>Create presentation</button>
        <button onClick={() => navigate("/enter")}>
          Enter to existing presentation
        </button>
      </div>
    </div>
  );
}
