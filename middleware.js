const Campsite = require('./models/Campsite')
const { campsiteSchema, reviewSchema } = require('./schemaJoi');
const ExpressError = require('./utlis/ExpressError');
const Review = require('./models/Review');

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campsite = await Campsite.findById(id);
    if (!campsite.author._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access');
        return res.redirect(`/campsites/${id}`);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/users/login');
    } else {
        next();
    }
}

module.exports.validateSchema = (req, res, next) => {
    const { error } = campsiteSchema.validate(req.body);
    if (error) {
        const message = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(message, 500);
    }
    else {
        next() 
    }
}

module.exports.validateReviewSchema = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(message, 500);
    }
    else {
        next()
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;

    } else {
        res.locals.returnTo = '/campsites'; 
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access');
        return res.redirect(`/campsites/${id}`);
    } else {
        next();
    }
}