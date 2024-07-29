const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utlis/catchAsync');
const { isLoggedIn, isAuthor, validateSchema } = require('../middleware');
const campsites = require('../controllers/campsites');
const multer = require('multer');
const { storage } = require('../cloudinary/cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campsites.index))

router.route('/new')
    .get(isLoggedIn, campsites.renderNewForm)
    .post(isLoggedIn, upload.array('image', 5), validateSchema, catchAsync(campsites.createCampsite))

router.route('/map')
    .get(catchAsync(campsites.renderMap))

router.route('/:id')
    .get(catchAsync(campsites.showCampsite))
    .put(isLoggedIn, isAuthor, upload.array('image', 5), validateSchema, catchAsync(campsites.updateCampsite))
    .delete(isLoggedIn, isAuthor, catchAsync(campsites.deleteCampsite))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campsites.renderEditForm))


module.exports = router;