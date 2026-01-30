import httpStatus from "http-status";
import userService from "./user.service.js";
import ApiError from "../utils/ApiError.js";

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect username or password",
    );
  }
  return user;
};

export default {
  loginUserWithUsernameAndPassword,
};
