import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import ItemCard from "../components/ItemCard";
import AddItemModal from "../components/AddItemModal";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocket();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  const handleItemAdded = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/v1/items");
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateBid = (data) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === data.itemId || item._id === data.itemId) {
            return {
              ...item,
              currentBid: data.currentBid,
              currentBidder: data.currentBidder,
            };
          }
          return item;
        }),
      );
    };

    socket.on("UPDATE_BID", handleUpdateBid);

    return () => {
      socket.off("UPDATE_BID", handleUpdateBid);
    };
  }, [socket]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading items...</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Live Auction Dashboard
        </h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Hello, <strong>{user.username}</strong>
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add Item
              </button>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded text-gray-500">
          No active auctions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id || item._id} item={item} />
          ))}
        </div>
      )}

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemAdded={handleItemAdded}
      />
    </div>
  );
};

export default Dashboard;
