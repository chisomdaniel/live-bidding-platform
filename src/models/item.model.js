import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
      default: 0,
    },
    currentBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    auctionEndTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @typedef Item
 */
const Item = mongoose.model("Item", itemSchema);

export default Item;
