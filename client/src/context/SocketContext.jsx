import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from "axios";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    // Sync time with server
    const syncTime = async () => {
      try {
        const start = Date.now();
        const response = await axios.get("/v1/health");
        const end = Date.now();
        const latency = (end - start) / 2;
        const serverTime = new Date(response.data.timestamp).getTime();
        // Server Time approx = serverTime + latency (since timestamp was generated at server)
        // offset = (serverTime + latency) - end
        const offset = serverTime + latency - end;
        setTimeOffset(offset);
        console.log("Time synced. Offset:", offset);
      } catch (error) {
        console.error("Failed to sync time:", error);
      }
    };

    syncTime();
    const interval = setInterval(syncTime, 60000); // Sync every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (token) {
      console.log("Initializing socket connection to http://localhost:3000");
      // Connecting directly to backend to avoid proxy issues with WebSockets
      const newSocket = io("http://localhost:3000", {
        auth: { token },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("BID_ERROR", (err) => {
        console.error("Bid error:", err);
        alert(`Bid failed: ${err.message}`);
      });

      newSocket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, timeOffset }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
