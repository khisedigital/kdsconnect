import * as authService from '../services/auth.service.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const session = await authService.login(req.body);
  res.json(session);
});

export const registerRetailer = asyncHandler(async (req, res) => {
  const session = await authService.registerRetailer(req.body);
  res.status(201).json(session);
});

export const registerSupplier = asyncHandler(async (req, res) => {
  const session = await authService.registerSupplier(req.body);
  res.status(201).json(session);
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.json(user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body);
  res.json(result);
});

export const passwordReset = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body);
  res.json(result);
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await authService.refreshSession(req.body.refreshToken);
  res.json(session);
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.id, req.body?.refreshToken);
  res.json(result);
});

export const startMobile = asyncHandler(async (req, res) => {
  const result = await authService.startMobileVerification(
    req.user.id,
    req.body.phone,
  );
  res.json(result);
});

export const verifyMobile = asyncHandler(async (req, res) => {
  const user = await authService.verifyMobileOtp(req.user.id, req.body);
  res.json(user);
});
