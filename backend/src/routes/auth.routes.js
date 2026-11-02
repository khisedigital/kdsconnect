import {Router} from 'express';

import * as authController from '../controllers/auth.controller.js';
import {authenticate} from '../middleware/auth.js';
import {validate} from '../middleware/validate.js';
import {
  changePasswordSchema,
  loginSchema,
  passwordResetSchema,
  refreshSchema,
  registerRetailerSchema,
  registerSupplierSchema,
  startMobileSchema,
  verifyMobileSchema,
} from '../validators/authValidators.js';

const router = Router();

router.post('/login', validate('body', loginSchema), authController.login);
router.post(
  '/register/retailer',
  validate('body', registerRetailerSchema),
  authController.registerRetailer,
);
router.post(
  '/register/supplier',
  validate('body', registerSupplierSchema),
  authController.registerSupplier,
);
router.post(
  '/password-reset',
  validate('body', passwordResetSchema),
  authController.passwordReset,
);
router.post('/refresh', validate('body', refreshSchema), authController.refresh);

router.get('/me', authenticate, authController.me);
router.post(
  '/change-password',
  authenticate,
  validate('body', changePasswordSchema),
  authController.changePassword,
);
router.post('/logout', authenticate, authController.logout);
router.post(
  '/mobile/start',
  authenticate,
  validate('body', startMobileSchema),
  authController.startMobile,
);
router.post(
  '/mobile/verify-otp',
  authenticate,
  validate('body', verifyMobileSchema),
  authController.verifyMobile,
);

export default router;
