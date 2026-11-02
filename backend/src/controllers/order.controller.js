import * as orderService from '../services/order.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  res.json(await orderService.listOrders(req.user, req.query));
});

export const detail = asyncHandler(async (req, res) => {
  res.json(await orderService.getOrder(req.user, req.params.id));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await orderService.createOrder(req.user, req.body));
});

export const cancel = asyncHandler(async (req, res) => {
  res.json(await orderService.cancelOrder(req.user, req.params.id));
});
