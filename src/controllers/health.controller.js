import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';

export const getHealth = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ 
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});
