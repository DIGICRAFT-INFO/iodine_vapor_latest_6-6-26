const express = require('express');
const ctrl = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.get('/',        ctrl.getBrands);
router.get('/admin',   protect, ctrl.getAllBrands);
router.post('/',       protect, ctrl.createBrand);
router.put('/reorder', protect, ctrl.reorderBrands);  // must be before /:id
router.put('/:id',     protect, ctrl.updateBrand);
router.delete('/:id',  protect, ctrl.deleteBrand);

module.exports = router;
