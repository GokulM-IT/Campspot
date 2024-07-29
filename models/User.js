const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const { DateTime } = require('luxon');

const userSchema = new Schema({
    date: String,
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose);

userSchema.virtual('getRelativeTime').get(function () {
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

module.exports = mongoose.model('User', userSchema);