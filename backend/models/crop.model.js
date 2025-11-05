const mongoose = require('mongoose');
const { Schema } = mongoose;

const Crop = mongoose.model('crop', {
	name: String,
	scientificName: String,
	startDate: Date
});

module.exports = Crop;
