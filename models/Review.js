const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const { DateTime } = require('luxon')

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    date: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    }
})

reviewSchema.virtual('formatedDate').get(function () {
    const fromDate = DateTime.fromISO(this.date)
    const monthName = fromDate.toLocaleString({ month: 'long' });
    const year = fromDate.year;
    return `${monthName} ${year}`
})

reviewSchema.virtual('getRelativeTime').get(function () {
    const now = DateTime.now();
    const startDate = DateTime.fromISO(this.date);
    const days = now.diff(startDate, 'days').days;

    if (days < 1) {
        return "Today";
    } else if (days < 2) {
        return "Yesterday";
    } else {
        const years = now.diff(startDate, 'years').years;
        const months = now.diff(startDate, 'months').months;

        if (Math.floor(years) > 0) {
            return `${Math.floor(years)} year${Math.floor(years) > 1 ? 's' : ''}`;
        } else if (Math.floor(months) > 0) {
            return `${Math.floor(months)} month${Math.floor(months) > 1 ? 's' : ''}`;
        } else {
            return `${Math.floor(days)} day${Math.floor(days) > 1 ? 's' : ''}`;
        }
    }
})

module.exports = mongoose.model('Review', reviewSchema);