const Agriculture = require('../models/agricultural.model');

module.exports.Agriculture = async (req, res) => {
	// const agricultureList = await 
	const data = await Agriculture.find()
	console.log(data)
	res.status(200).json(data)
}

module.exports.getAgricultureById = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Agriculture.findById(id);
    if (!farm) {
      return res.status(404).json({ message: "Không tìm thấy nông trại" });
    }
    res.status(200).json(farm);
  } catch (error) {
    console.error(" Lỗi khi lấy nông trại theo ID:", error);
    res.status(500).json({ message: "Lỗi server khi lấy nông trại" });
  }
};