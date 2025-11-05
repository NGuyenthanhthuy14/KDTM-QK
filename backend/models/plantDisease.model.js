const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlantDisease = mongoose.model('plantDisease', {
	plant_name: String, 
	disease_name: String,
	symptoms: String,
	cause: String, 
	treatment: String,
	image_url: String,
});

module.exports = PlantDisease;
