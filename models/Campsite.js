const mongoose = require('mongoose');
const User = require('./User')
const Review = require('./Review');
const { Schema } = mongoose;
const { cloudinary } = require('../cloudinary/cloudinary');

const imageSchema = new Schema({
    url: String,
    filename: String
})

const opts = { toJSON: { virtuals: true } };

const campsiteSchema = new Schema({
    title: String,
    price: Number,
    images: [imageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: Review
    }]
}, opts)

campsiteSchema.virtual('properties.popupMark').get(function () {
    return `<h5><a href="/campsites/${this._id}">${this.title}</a></h5>
    <p>${this.description.substring(0, 20)}...</P>`
})

campsiteSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
        await Promise.all(
            doc.images.map(image => cloudinary.uploader.destroy(image.filename))
        );
    }
})

module.exports = mongoose.model('Campsite', campsiteSchema);