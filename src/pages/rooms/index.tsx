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
    <div>
      <div>Rooms page {status} {nickname}</div>
    </div>
  );
}
