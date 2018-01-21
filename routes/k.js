const router = require('express').Router();
const ctrl = require('../controllers/kCtrl.js');

router.get('/', ctrl.all);
router.get('/report', ctrl.report);
router.post('/prediction', ctrl.prediction);

module.exports = router;
