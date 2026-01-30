import Item from "../models/item.model.js";

class ItemService {
  /**
   * Create an item
   * @param {Object} itemBody
   * @returns {Promise<Item>}
   */
  async createItem(itemBody) {
    return Item.create(itemBody);
  }

  /**
   * Query for items
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @returns {Promise<QueryResult>}
   */
  async queryItems(filter, options) {
    const items = await Item.find(filter);
    return items;
  }

  /**
   * Get item by id
   * @param {ObjectId} id
   * @returns {Promise<Item>}
   */
  async getItemById(id) {
    return Item.findById(id);
  }

  /**
   * Update item by id
   * @param {ObjectId} itemId
   * @param {Object} updateBody
   * @returns {Promise<Item>}
   */
  async updateItemById(itemId, updateBody) {
    const item = await this.getItemById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    Object.assign(item, updateBody);
    await item.save();
    return item;
  }

  /**
   * Place a bid on an item
   * @param {ObjectId} itemId
   * @param {number} amount
   * @param {ObjectId} userId
   * @returns {Promise<Item>}
   */
  async placeBid(itemId, amount, userId) {
    const item = await this.getItemById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    if (new Date() > item.auctionEndTime) {
      throw new Error('Auction has ended');
    }

    // Atomic update to prevent race conditions
    // Only update if the proposed amount is greater than currentBid
    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, currentBid: { $lt: amount } },
      { $set: { currentBid: amount, currentBidder: userId } },
      { new: true }
    );

    if (!updatedItem) {
      // If no document was returned, it means either item missing (checked above)
      // or amount <= currentBid
      throw new Error('Bid must be higher than current bid');
    }

    return updatedItem;
  }

  /**   * Delete item by id
   * @param {ObjectId} itemId
   * @returns {Promise<Item>}
   */
  async deleteItemById(itemId) {
    const item = await this.getItemById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    await item.deleteOne();
    return item;
  }
}

export default new ItemService();
