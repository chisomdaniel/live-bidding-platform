import express from 'express';
import itemController from '../../controllers/item.controller.js';

const router = express.Router();

router
  .route('/')
  .post(itemController.createItem)
  .get(itemController.getItems);

export default router;
