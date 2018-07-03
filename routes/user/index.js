const router  = require('express').Router();
const user = require('../../controllers/user');

/**
 USER LOGIN, CREATE USER ROUTE NEED TO ADDED
*/
router.post('/requestCab', user.requestCab);
router.post('/checkRequest', user.checkRequest);
router.post('/getRequest', user.getRequest);
router.post('/register', user.register);

module.exports = router;
