import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import itemService from "./services/item.service.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        config.jwt.secret,
        (err, decoded) => {
          if (err) return next(new Error("Authentication error"));
          socket.user = decoded;
          next();
        },
      );
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}, User ID: ${socket.user.sub}`);

    socket.on("BID_PLACED", async (data) => {
      logger.info(
        `Received BID_PLACED: ${JSON.stringify(data)} from ${socket.user ? socket.user.sub : "unknown"}`,
      );
      try {
        const { itemId, amount } = data;

        // Use service to place valid bid
        // This method should throw if validation fails (auction ended, bid too low)
        const updatedItem = await itemService.placeBid(
          itemId,
          amount,
          socket.user.sub,
        );

        logger.info(
          `Bid success for item ${itemId}. New price: ${updatedItem.currentBid}`,
        );

        // Broadcast new bid to everyone in the item room (or globally if preferred)
        // UPDATE_BID: Server broadcasts the new highest bid to all connected clients
        io.emit("UPDATE_BID", {
          itemId,
          currentBid: updatedItem.currentBid,
          currentBidder: socket.user.sub,
        });

        // Acknowledge success to sender
        socket.emit("BID_SUCCESS", {
          itemId,
          amount: updatedItem.currentBid,
        });
      } catch (error) {
        logger.error(`Bid error: ${error.message}`);
        socket.emit("BID_ERROR", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      logger.info("Client disconnected");
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
