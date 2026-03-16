import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

let socket;

export function getSocket() {
  if (socket) return socket;

  const token = localStorage.getItem("token");

  socket = io(API_URL, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket connect error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
