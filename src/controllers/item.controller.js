import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import itemService from '../services/item.service.js';

const createItem = catchAsync(async (req, res) => {
  const item = await itemService.createItem(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const result = await itemService.queryItems(req.query);
  res.send(result);
});

export default {
  createItem,
  getItems,
};
