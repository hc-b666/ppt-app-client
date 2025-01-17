declare global {
  type Role = "author" | "viewer" | "editor";

  interface OnlineUserInfo {
    socketId: string;
    nickname: string;
    role: Role;
  }
}

export {};
