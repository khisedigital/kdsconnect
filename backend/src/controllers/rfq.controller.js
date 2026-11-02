import * as rfqService from '../services/rfq.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  res.json(await rfqService.listRfqs(req.user, req.query));
});

export const detail = asyncHandler(async (req, res) => {
  res.json(await rfqService.getRfq(req.user, req.params.id));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await rfqService.createRfq(req.user, req.body));
});

export const submit = asyncHandler(async (req, res) => {
  res.json(await rfqService.submitRfq(req.user, req.params.id));
});
