import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import { selectNickname } from "./userSlice";
import socket from "@/common/constants/socket";

interface Props {
  pptId: string | undefined;
}

export default function useJoinPresentation({ pptId }: Props) {
  const [status, setStatus] = useState("disconnected");
  const [users, setUsers] = useState<OnlineUserInfo[]>([]);
  const nickname = useAppSelector((state) => selectNickname(state));

  useEffect(() => {
    if (!pptId) return;

    const onConnect = () => {
      console.log("connected to server");
      setStatus("connected");
      socket.emit("join-ppt", pptId, nickname);
    };

    const onDisconnect = () => {
      console.log("disconnected to server");
      setStatus("disconnected");
      setUsers([]);
    };

    const newUser = ({
      users,
      joinedUser,
    }: {
      users: OnlineUserInfo[];
      joinedUser: OnlineUserInfo;
    }) => {
      console.log(joinedUser);
      setUsers(users);
    };

    const leftUser = ({
      users,
      leftUser,
    }: {
      users: OnlineUserInfo[];
      leftUser: OnlineUserInfo;
    }) => {
      console.log(leftUser);
      setUsers(users);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-user-joined", newUser);
    socket.on("user-left", leftUser);

    socket.connect();

    return () => {
      socket.emit("leave-ppt", pptId);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-user-joined", newUser);
      socket.off("user-left", leftUser);
      socket.disconnect();
    };
  }, [pptId]);

  return { status, users };
}
