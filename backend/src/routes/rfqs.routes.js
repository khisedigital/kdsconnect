import {Router} from 'express';

import * as rfqController from '../controllers/rfq.controller.js';
import {authenticate, requireRoles} from '../middleware/auth.js';
import {validate} from '../middleware/validate.js';
import {createRfqSchema} from '../validators/rfqValidators.js';

const router = Router();

router.use(authenticate);
router.get('/', rfqController.list);
router.post(
  '/',
  requireRoles('retailer'),
  validate('body', createRfqSchema),
  rfqController.create,
);
router.get('/:id', rfqController.detail);
router.post('/:id/submit', requireRoles('retailer'), rfqController.submit);

export default router;
