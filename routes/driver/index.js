const router   = require('express').Router();
const driver = require('../../controllers/driver');

/**
 * DRIVER LOGIN/CREATE ROUTE NEED TO ADDED
*/
router.get('/waitingrequest/:driverId', driver.getRequest);
router.get('/waitingrequest/:driverId/:status', driver.getRequest);
router.post('/submitrequest', driver.submitRequest);
router.get('/allRequest', driver.getAllRequest);

module.exports = router;
