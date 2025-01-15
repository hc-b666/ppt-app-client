import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import { selectNickname } from "../user/userSlice";
import socket from "@/common/constants/socket";

interface UserInfo {
  socketId: string;
  nickname: string;
}

interface Props {
  pptId: string | undefined;
}

export default function useJoinPresentation({ pptId }: Props) {
  const [status, setStatus] = useState("disconnected");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const nickname = useAppSelector((state) => selectNickname(state));

  useEffect(() => {
    if (!pptId) return;

    const onConnect = () => {
      console.log("connected to server");
      setStatus("connected");
      if (pptId) {
        socket.emit("join-ppt", pptId, nickname);
      }
    };

    const onDisconnect = () => {
      console.log("disconnected to server");
      setStatus("disconnected");
      setUsers([]);
    };

    const newUser = ({ users, joinedUser }: { users: UserInfo[], joinedUser: UserInfo }) => {
      console.log(users);
      console.log(joinedUser);
      setUsers(users);
    };

    const leftUser = ({ users, leftUser }: { users: UserInfo[], leftUser: UserInfo }) => {
      console.log(users);
      console.log(leftUser);
      setUsers(users);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-user-joined", newUser);
    socket.on("user-left", leftUser);

    socket.connect();

    return () => {
      if (pptId) {
        socket.emit("leave-ppt", pptId);
      }
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-user-joined", newUser);
      socket.off("user-left", leftUser);
      socket.disconnect();
    };
  }, [pptId]);

  return { status, users };
}
