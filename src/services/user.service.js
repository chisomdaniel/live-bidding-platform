import User from "../models/user.model.js";

class UserService {
  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  async createUser(userBody) {
    let { username } = userBody;

    if (await User.isUsernameTaken(username)) {
      let isTaken = true;
      let newUsername;

      while (isTaken) {
        // Generate random number between 10 and 999 (covering 2-3 digits)
        const suffix = Math.floor(Math.random() * 990) + 10;
        newUsername = `${username}${suffix}`;
        // eslint-disable-next-line no-await-in-loop
        isTaken = await User.isUsernameTaken(newUsername);
      }
      username = newUsername;
    }

    // eslint-disable-next-line no-param-reassign
    userBody.username = username;
    return User.create(userBody);
  }

  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  async getUserById(id) {
    return User.findById(id);
  }

  /**
   * Get user by username
   * @param {string} username
   * @returns {Promise<User>}
   */
  async getUserByUsername(username) {
    return User.findOne({ username });
  }
}

export default new UserService();
