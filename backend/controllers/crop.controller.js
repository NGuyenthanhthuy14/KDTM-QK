const Crop = require('../models/crop.model');

module.exports.Crop = async (req, res) => {
	// const agricultureList = await 
	const data = await Crop.find()
	console.log(data)
	res.status(200).json(data)
}

module.exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCrop = await Crop.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedCrop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cập nhật thất bại' });
  }
};

// Xóa cây trồng
module.exports.deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCrop = await Crop.findByIdAndDelete(id);
    if (!deletedCrop) return res.status(404).json({ message: 'Không tìm thấy cây trồng' });
    res.status(200).json({ message: 'Xóa thành công', deletedCrop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xóa thất bại' });
  }
};

// Thêm cây trồng mới
module.exports.addCrop = async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Thêm cây trồng thất bại' });
  }
};
