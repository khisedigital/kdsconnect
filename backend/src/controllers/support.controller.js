import * as supportService from '../services/support.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const listMine = asyncHandler(async (req, res) => {
  res.json(await supportService.listMyQueries(req.user, req.query));
});

export const listAll = asyncHandler(async (req, res) => {
  res.json(await supportService.listAllQueries(req.query));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await supportService.createQuery(req.user, req.body));
});

export const updateStatus = asyncHandler(async (req, res) => {
  res.json(await supportService.updateQueryStatus(req.params.id, req.body));
});
