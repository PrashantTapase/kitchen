const router = require('express').Router();
const productCtrl = require('./k.js');
const orderCtrl = require('../controllers/orderCtrl.js');

router.use('/products', productCtrl);
router.post('/order', orderCtrl.order);
router.post('/order/complete', orderCtrl.complete);

module.exports = router;
