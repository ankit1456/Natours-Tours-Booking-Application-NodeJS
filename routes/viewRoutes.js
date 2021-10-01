const express = require('express');
const viewsController = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/signin', isLoggedIn, viewsController.getLoginForm);
router.get('/signup', isLoggedIn, viewsController.getSignupForm);
router.get('/me', protect, viewsController.getAccount);
router.get('/my-tours', protect, viewsController.getMyTours);
module.exports = router;
