import * as productService from '../services/product.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  res.json(await productService.listProducts(req.query));
});

export const detail = asyncHandler(async (req, res) => {
  res.json(await productService.getProduct(req.params.id));
});

export const categories = asyncHandler(async (_req, res) => {
  res.json(await productService.listCategories());
});
