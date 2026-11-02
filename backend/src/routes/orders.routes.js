import {Router} from 'express';

import * as orderController from '../controllers/order.controller.js';
import {authenticate, requireRoles} from '../middleware/auth.js';
import {validate} from '../middleware/validate.js';
import {createOrderSchema} from '../validators/rfqValidators.js';

const router = Router();

router.use(authenticate);
router.get('/', orderController.list);
router.post(
  '/',
  requireRoles('retailer'),
  validate('body', createOrderSchema),
  orderController.create,
);
router.get('/:id', orderController.detail);
router.post('/:id/cancel', requireRoles('retailer'), orderController.cancel);

export default router;
