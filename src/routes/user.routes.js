const express = require('express');
const router = express.Router();
const { getMe, getAllUsers } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

router.get('/me', protect, getMe);
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;
