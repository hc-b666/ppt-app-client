import { useEffect, useState } from "react";
import socket from "./socket";

export function App() {
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
      setStatus("connected");
    });
  }, [socket]);

  return (
    <div>
      <div className="text-2xl">Status: {status}</div>
    </div>
  );
}

