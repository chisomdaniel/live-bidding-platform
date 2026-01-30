import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import clsx from "clsx";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const { socket, timeOffset } = useSocket();
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [flash, setFlash] = useState(false);
  const [outbid, setOutbid] = useState(false);
  const [prevBidder, setPrevBidder] = useState(item.currentBidder);

  const isWinning = user && item.currentBidder === (user.id || user._id);

  // Flash effect on price change
  useEffect(() => {
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  }, [item.currentBid]);

  // Outbid detection
  useEffect(() => {
    // If I was the bidder, and now I'm not, and the auction hasn't ended
    const userId = user?.id || user?._id;
    if (
      userId &&
      prevBidder === userId &&
      item.currentBidder !== userId &&
      !isEnded
    ) {
      setOutbid(true);
    } else if (isWinning) {
      setOutbid(false);
    }
    setPrevBidder(item.currentBidder);
  }, [item.currentBidder, user, prevBidder, isEnded, isWinning]);

  // Timer logic
  useEffect(() => {
    const updateTimer = () => {
      const serverNow = Date.now() + timeOffset;
      const end = new Date(item.auctionEndTime).getTime();
      const diff = end - serverNow;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setIsEnded(true);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
      );
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [item.auctionEndTime, timeOffset]);

  const placeBid = () => {
    if (!socket || !user) {
      alert("Please login to bid");
      return;
    }
    const nextBid = item.currentBid + 10;
    socket.emit("BID_PLACED", { itemId: item.id || item._id, amount: nextBid });
  };

  return (
    <div
      className={clsx(
        "bg-white shadow-md rounded-lg p-4 border-2 transition-colors duration-300 relative overflow-hidden",
        isWinning
          ? "border-green-500 bg-green-50"
          : outbid
            ? "border-red-500 bg-red-50"
            : "border-transparent",
      )}
    >
      {/* Flash overlay */}
      <div
        className={clsx(
          "absolute inset-0 bg-green-400 opacity-0 transition-opacity duration-300 pointer-events-none",
          flash && "opacity-30",
        )}
      ></div>

      <h3 className="text-lg font-bold mb-2 text-gray-800">{item.title}</h3>

      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-gray-500 text-sm">Current Price</p>
          <p
            className={clsx(
              "text-2xl font-bold transition-transform",
              flash ? "scale-110" : "scale-100",
            )}
          >
            {formatCurrency(item.currentBid)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Ends In</p>
          <p className="text-xl font-mono text-gray-700 font-semibold">
            {timeLeft}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {isWinning && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
            Winning
          </span>
        )}
        {outbid && !isWinning && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded border border-red-400">
            Outbid!
          </span>
        )}
        {!isWinning && !outbid && <div></div>}

        <button
          onClick={placeBid}
          disabled={isEnded || (user && isWinning)}
          className={clsx(
            "px-4 py-2 rounded font-bold text-white transition-colors",
            isEnded
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
          )}
        >
          Bid +$10
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
