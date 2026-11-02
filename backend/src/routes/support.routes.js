import {Router} from 'express';

import * as supportController from '../controllers/support.controller.js';
import {authenticate, requireRoles} from '../middleware/auth.js';
import {validate} from '../middleware/validate.js';
import {
  createSupportQuerySchema,
  updateSupportStatusSchema,
} from '../validators/supportValidators.js';

const router = Router();

router.use(authenticate);

router.get('/queries/mine', supportController.listMine);
router.post(
  '/queries',
  requireRoles('retailer', 'supplier', 'sales'),
  validate('body', createSupportQuerySchema),
  supportController.create,
);
router.get(
  '/queries',
  requireRoles('admin'),
  supportController.listAll,
);
router.patch(
  '/queries/:id/status',
  requireRoles('admin'),
  validate('body', updateSupportStatusSchema),
  supportController.updateStatus,
);

export default router;
