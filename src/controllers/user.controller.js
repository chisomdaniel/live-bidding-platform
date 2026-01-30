import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import userService from '../services/user.service.js';
import ApiError from '../utils/ApiError.js';

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

export default {
  createUser,
  getUser,
};
