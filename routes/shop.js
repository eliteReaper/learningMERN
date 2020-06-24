const express = require('express');
const shopContoller = require('../controllers/shop');

const router = express.Router();

router.get('/cart', shopContoller.getCartItems);
router.post('/add-to-cart', shopContoller.postCart);
router.post('/delete-from-cart', shopContoller.deleteCartItems);
router.post('/place-order', shopContoller.postOrder);
router.get('/orders', shopContoller.getOrders);
router.get('/', shopContoller.getShopProducts);

module.exports = router;