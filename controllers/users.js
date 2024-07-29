const { DateTime } = require('luxon');
const User = require('../models/User');

module.exports.renderRegisterForm = (req, res) => {
    res.render('campsites/users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const date = DateTime.now();
        const user = new User({ email, username, date });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to campspot!');
            res.redirect('/campsites');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/users/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('campsites/users/login')
}

module.exports.login = async (req, res) => {
    const redirectTo = res.locals.returnTo;
    req.flash('success', 'Welcome back!');
    res.redirect(redirectTo);
}

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Goodbye!!');
        res.redirect('/campsites');
    })
}