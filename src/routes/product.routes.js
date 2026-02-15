const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

router.post('/', protect, authorize('admin', 'manager'), createProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
