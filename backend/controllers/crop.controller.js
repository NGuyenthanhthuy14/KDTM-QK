const Crop = require('../models/crop.model');

module.exports.Crop = async (req, res) => {
	// const agricultureList = await 
	const data = await Crop.find()
	console.log(data)
	res.status(200).json(data)
}
