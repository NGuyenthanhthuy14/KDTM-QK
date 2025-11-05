const PlantDisease = require('../models/plantDisease.model');
const fetch = require('node-fetch');

module.exports.predictPlantDisease = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Chưa có ảnh gửi lên" });

    // 1️⃣ Gửi ảnh tới AI Node (Gemini / OpenAI)
    const aiResponse = await fetch('YOUR_GEMINI_AI_ENDPOINT', {
      method: 'POST',
      body: req.file.buffer, // binary
      headers: {
        'Content-Type': 'application/octet-stream',
        // Nếu Gemini cần API Key: 'Authorization': 'Bearer YOUR_KEY'
      }
    });

    const aiData = await aiResponse.json();
    const aiSymptoms = aiData.description || ""; // ví dụ AI trả về triệu chứng

    // 2️⃣ Lấy dữ liệu bệnh từ MongoDB
    const diseases = await PlantDisease.find();

    // 3️⃣ So khớp triệu chứng AI với MongoDB
    let bestMatch = null;
    let maxScore = 0;

    for (const d of diseases) {
      const match = aiSymptoms.split(" ").filter(word => d.symptoms.includes(word)).length;
      const score = match / aiSymptoms.split(" ").length;
      if (score > maxScore) {
        maxScore = score;
        bestMatch = d;
      }
    }

    // 4️⃣ Trả JSON cho frontend
    res.json({
      plant_name: bestMatch?.plant_name || "Không xác định",
      disease_name: bestMatch?.disease_name || "Không xác định",
      confidence: maxScore,
      symptoms_description: aiSymptoms || "Không có dữ liệu",
      solution: bestMatch?.treatment || "Không có thông tin",
      image_url: bestMatch?.image_url || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Có lỗi xảy ra trong quá trình phân tích" });
  }
};
