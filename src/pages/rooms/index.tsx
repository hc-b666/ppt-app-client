import { useEffect, useState } from "react";
import socket from "@/common/constants/socket";
import { useAppSelector } from "@/app/store";

export default function RoomsPage() {
  const [status, setStatus] = useState("disconnected");
  const nickname = useAppSelector((state) => state.user.nickname);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
      setStatus("connected");
    });
  }, [socket]);

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold">{status}{nickname}</h1>
    </main>
  );
}
