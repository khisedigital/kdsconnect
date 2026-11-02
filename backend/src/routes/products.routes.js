import {Router} from 'express';

import * as productController from '../controllers/product.controller.js';
import {authenticate} from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.get('/', productController.list);
router.get('/categories', productController.categories);
router.get('/:id', productController.detail);

export default router;
