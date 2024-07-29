const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utlis/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;