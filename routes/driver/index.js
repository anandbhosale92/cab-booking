const router   = require('express').Router();
const driver = require('../../controllers/driver');

/**
 * DRIVER LOGIN/CREATE ROUTE NEED TO ADDED
*/
router.get('/waitingrequest/:driverId', driver.getRequest);
router.post('/submitrequest', driver.submitRequest);

module.exports = router;
