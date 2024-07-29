if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utlis/ExpressError');
const mongoSanitize = require('express-mongo-sanitize'); 
const helmet = require('helmet'); 
const mongoStore = require('connect-mongo');
const multer = require('multer');

const User = require('./models/User');
const passport = require('passport');

const campsitesRoutes = require('./routes/campsites')
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

const url = process.env.MONGODB_URL || ' mongodb://127.0.0.1:27017/campspot';

mongoose.connect(url)
    .then(() => {
        console.log('Database Connected.');
    })
    .catch((error) => {
        throw error;
    })

const app = express();
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.static(path.join(__dirname + '/public')))

app.use(mongoSanitize())
app.use(helmet({ contentSecurityPolicy: false }));

const store = mongoStore.create({
    mongoUrl: url,
    touchAfter: 24 * 60 * 60, 
    crypto: {
        secret: process.env.SECRET || 'thisissecret'
    }
})

const sessionConfig = {
    name: 'setsesscok', 
    secret: process.env.SECRET || 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 

        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store 
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.redirect('/campsites')
})

app.use('/campsites', campsitesRoutes);
app.use('/campsites/:id/review', reviewsRoutes);
app.use('/users', usersRoutes);

app.all('*', (req, res, next) => {
    res.status(404).render('notFound')

})

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        err.statusCode = err.statusCode || 400;
        err.message = 'The maximum limit for images is 5';

    } else {

        err.statusCode = err.statusCode || 500;
        if (!err.message) err.message = 'oh no, something went wrong.'
    }
    res.status(err.statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});