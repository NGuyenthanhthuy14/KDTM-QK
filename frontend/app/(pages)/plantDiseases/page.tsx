"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Loader2, UploadCloud } from "lucide-react";

type PlantResult = {
  plant_name: string;
  disease_name: string;
  symptoms: string;
  cause: string;
  prevention: string;
  treatment: string;
  image_url: string;
  confidence?: number;
};

export default function SmartFarm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlantResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!file) {
      alert("🌿 Vui lòng chọn ảnh cây trước khi phân tích!");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("data", file);

      const response = await fetch("/api/plantDiseases", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Lỗi từ server:", text);
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PlantResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error("❌ Lỗi khi kết nối:", err);
      setError("Không thể kết nối tới máy chủ AI. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-50 via-green-100 to-blue-50 py-10 px-4">
      {/* Background animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-green-200/30 rounded-full top-[-50px] left-[-50px] animate-blob"></div>
        <div className="absolute w-96 h-96 bg-yellow-200/30 rounded-full bottom-[-100px] right-[-50px] animate-blob animation-delay-2000"></div>
        <div className="absolute w-72 h-72 bg-blue-200/20 rounded-full top-[200px] right-[150px] animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Header */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <Leaf className="text-green-600 w-10 h-10 animate-bounce" />
          <h1 className="text-4xl font-bold text-green-700">
            Nông Trại Thông Minh 🌾
          </h1>
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          Tải ảnh cây trồng để AI phân tích bệnh và đưa ra hướng dẫn chăm sóc.
        </p>

        {/* Upload */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <div className="w-full sm:w-80 flex flex-col items-center">
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="mb-3 w-full h-48 object-cover rounded-xl border shadow-md"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full border border-green-300 rounded-2xl p-3 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 flex items-center gap-2 disabled:opacity-60 transition shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Đang phân tích...
              </>
            ) : (
              <>
                Phân tích ngay <UploadCloud className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm shadow-inner"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 border border-green-200 text-left mt-6 overflow-hidden"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
              🧠 Kết quả phân tích
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Cây */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="font-semibold text-green-700 mb-1">Cây:</p>
                <p className="text-gray-800">{result.plant_name}</p>
              </div>

              {/* Bệnh */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="font-semibold text-green-700 mb-1">Bệnh:</p>
                <p className="text-gray-800">{result.disease_name}</p>
              </div>

              {/* Triệu chứng */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="font-semibold text-green-700 mb-1">Triệu chứng:</p>
                <p className="text-gray-800">{result.symptoms}</p>
              </div>

              {/* Nguyên nhân */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="font-semibold text-green-700 mb-1">Nguyên nhân:</p>
                <p className="text-gray-800">{result.cause}</p>
              </div>

              {/* Phòng bệnh */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="font-semibold text-green-700 mb-1">Phòng bệnh:</p>
                <p className="text-gray-800">{result.prevention}</p>
              </div>

              {/* Điều trị */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <p className="font-semibold text-green-700 mb-1">Điều trị:</p>
                <p className="text-gray-800">{result.treatment}</p>
              </div>

              {/* Độ tin cậy */}
              {result.confidence !== undefined && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                  <p className="font-semibold text-green-700 mb-1">Độ tin cậy:</p>
                  <p className="text-gray-800">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </motion.div>

      {/* Tailwind animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
