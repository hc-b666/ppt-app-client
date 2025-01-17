import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { selectNickname } from "./userSlice";
import socket from "@/common/constants/socket";
import useVerifyAuthor from "../ppt/useVerifyAuthor";
import { selectAuthorToken } from "../ppt/presentationsSlice";

export default function useJoinPresentation() {
  const { id: pptId } = useParams();
  const [status, setStatus] = useState("disconnected");
  const [users, setUsers] = useState<OnlineUserInfo[]>([]);
  const nickname = useAppSelector((state) => selectNickname(state));
  const isAuthor = useVerifyAuthor();
  const authorToken = useAppSelector((state) =>
    selectAuthorToken(state, pptId)
  );

  useEffect(() => {
    if (!pptId) return;

    const onConnect = () => {
      console.log("connected to server");
      setStatus("connected");
      socket.emit("join-ppt", {
        pptId,
        nickname,
        role: isAuthor ? "author" : "viewer",
        authorToken,
      });
    };

    const onDisconnect = () => {
      console.log("disconnected to server");
      setStatus("disconnected");
      setUsers([]);
    };

    const newUser = ({ users }: { users: OnlineUserInfo[] }) => {
      setUsers(users);
    };

    const leftUser = ({ users }: { users: OnlineUserInfo[] }) => {
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
