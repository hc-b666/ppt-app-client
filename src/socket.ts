import { io } from "socket.io-client";
import { BACKEND_BASE_URL } from "./constants";

const socket = io(BACKEND_BASE_URL, {
  // cert: ENV === 'production' ? SSL_CERT : '',
  // key: ENV === 'production' ? SSL_KEY : '',
  transports: ["websocket", "polling"],
  path: "/socket.io",
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
});

export default socket;
