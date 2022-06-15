import express from 'express';

const router = express.Router();

import {
    getProducts,
    likeAProduct
} from '../controllers/product.controller';

router.route('/api/products').get(getProducts);
router.route('/api/products/:id/like').post(likeAProduct);

export default router;