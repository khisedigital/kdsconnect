import * as salesService from '../services/sales.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  res.json(await salesService.getSalesDashboard(req.user.id));
});

export const accounts = asyncHandler(async (req, res) => {
  res.json(await salesService.listAccounts(req.user.id, req.query));
});

export const onboardRetailer = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json(await salesService.onboardRetailer(req.user.id, req.body));
});

export const onboardWholesaler = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json(await salesService.onboardWholesaler(req.user.id, req.body));
});
