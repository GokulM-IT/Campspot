const Campsite = require('../models/Campsite');
const Review = require('../models/Review');
const { DateTime } = require('luxon');

module.exports = {
    createReview: async (req, res, next) => {
        const campsite = await Campsite.findById(req.params.id).populate('reviews');
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campsite.reviews.push(review);
        review.date = DateTime.now();
        await campsite.save();
        await review.save();
        await campsite.save()
        req.flash('success', 'Successfully added review!');
        res.redirect(`/campsites/${req.params.id}`)
    },
    deleteReview: async (req, res, next) => {
        const { id, reviewId } = req.params;
        await Campsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted review.');
        res.redirect(`/campsites/${id}`);
    }
}
