const { cloudinary } = require('../cloudinary/cloudinary');
const Campsite = require('../models/Campsite');
const maptilerClient = require('@maptiler/client');

maptilerClient.config.apiKey = process.env.MAPTILER_API;

module.exports.index = async (req, res, next) => {
    let campsites;
    if (req.query.query) {
        campsites = await Campsite.find().populate('reviews');
    } else {
        campsites = await Campsite.find().limit(32).populate('reviews');
    }
    res.render('campsites/index', { campsites })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campsites/new')
}

module.exports.renderMap = async (req, res) => {
    const campsites = await Campsite.find();
    res.render('campsites/map', { campsites })
}

module.exports.createCampsite = async (req, res) => {
    const geocoding = await maptilerClient.geocoding.forward(req.body.campsites.location);
    const campsite = new Campsite(req.body.campsites);
    campsite.geometry = geocoding.features[0].geometry;
    campsite.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campsite.author = req.user._id;
    campsite.description = req.body.campsites.description.substring(0, 483);
    await campsite.save();
    req.flash('success', 'Successfully added campsite');
    res.redirect(`/campsites/${campsite._id}`);
}

module.exports.showCampsite = async (req, res) => {
    const campsite = await Campsite.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author' 
            }
        })
        .populate('author'); 
    if (!campsite) {
        req.flash('error', 'Cannot find that campsite');
        res.redirect('/campsites');
    }
    res.render('campsites/show', { campsite })
}

module.exports.renderEditForm = async (req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    if (!campsite) {
        req.flash('error', 'Cannot find that campsite');
        res.redirect('/campsites');
    }
    res.render('campsites/edit', { campsite })
}

module.exports.updateCampsite = async (req, res) => {
    const { id } = req.params;
    const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsites });
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));

    if (req.body.deleteImages && campsite.images.length === req.body.deleteImages.length) {
        if (images.length === 0) { 
            req.flash('error', 'The campsite should have at least one image')
            return res.redirect(`/campsites/${id}/edit`)
        }
    }
    campsite.images.push(...images);
    if (req.body.deleteImages) {
        await Promise.all(
            req.body.deleteImages.map(filename => cloudinary.uploader.destroy(filename))
        );
        await campsite.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    if (req.body.campsites.location !== campsite.location) {
        const geocoding = await maptilerClient.geocoding.forward(req.body.campsites.location);
        campsite.geometry = geocoding.features[0].geometry;
    }
    campsite.description = req.body.campsites.description.substring(0, 483);
    await campsite.save();
    req.flash('success', 'Successfully updated campsite');
    res.redirect(`/campsites/${id}`)
}

module.exports.deleteCampsite = async (req, res) => {
    await Campsite.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campsite');
    res.redirect('/campsites');
}