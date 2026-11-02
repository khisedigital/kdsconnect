import {Router} from 'express';
import {z} from 'zod';

import * as salesController from '../controllers/sales.controller.js';
import {authenticate, requireRoles} from '../middleware/auth.js';
import {validate} from '../middleware/validate.js';

const onboardRetailerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(10).max(20),
});

const onboardWholesalerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(10).max(20),
  taxId: z.string().trim().max(64).optional(),
});

const router = Router();

router.use(authenticate, requireRoles('sales'));
router.get('/dashboard', salesController.dashboard);
router.get('/accounts', salesController.accounts);
router.post(
  '/onboard/retailer',
  validate('body', onboardRetailerSchema),
  salesController.onboardRetailer,
);
router.post(
  '/onboard/wholesaler',
  validate('body', onboardWholesalerSchema),
  salesController.onboardWholesaler,
);

export default router;
