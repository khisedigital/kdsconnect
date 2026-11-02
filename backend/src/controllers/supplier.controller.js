import * as productService from '../services/product.service.js';
import * as orderService from '../services/order.service.js';
import * as supplierService from '../services/supplier.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  res.json(await supplierService.getSupplierDashboard(req.user.id));
});

export const products = asyncHandler(async (req, res) => {
  res.json(await productService.listSupplierProducts(req.user.id, req.query));
});

export const orders = asyncHandler(async (req, res) => {
  res.json(await orderService.listOrders(req.user, req.query));
});
