const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/products', productsController.getAllProducts);
router.post('/add-product', productsController.postAddProduct);
router.post('/edit-product', productsController.editProduct);
router.post('/delete-product', productsController.deleteProduct);

module.exports = router;