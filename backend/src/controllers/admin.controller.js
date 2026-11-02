import * as adminService from '../services/admin.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (_req, res) => {
  res.json(await adminService.getDashboard());
});

export const activeOrders = asyncHandler(async (req, res) => {
  res.json(await adminService.listActiveOrders(req.query));
});

export const requestedQuotations = asyncHandler(async (req, res) => {
  res.json(await adminService.listRequestedQuotations(req.query));
});
