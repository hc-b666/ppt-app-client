import useJoinPresentation from "./useJoinPresentation";
import { Wifi, WifiOff } from "lucide-react";

export default function OnlineUsers() {
  const { status, users } = useJoinPresentation();

  const statusIcon = status ? (
    <div title="Connected">
      <Wifi className="w-5 h-5 text-green-500" />
    </div>
  ) : (
    <div title="Disconnected">
      <WifiOff className="w-5 h-5 text-red-500" />
    </div>
  );

  return (
    <div className="col-span-1 flex flex-col px-3 border-x">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Online Users</h4>
        {statusIcon}
      </div>
      <div className="flex flex-col gap-1">
        {users.map((u) => (
          <span key={u.socketId}>{u.nickname} ({u.role})</span>
        ))}
      </div>
    </div>
  );
}
