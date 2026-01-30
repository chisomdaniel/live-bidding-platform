import express from 'express';
import userController from '../../controllers/user.controller.js';

const router = express.Router();

router
  .route('/')
  .post(userController.createUser);

router
  .route('/:userId')
  .get(userController.getUser);

export default router;
