"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  MapPin,
  Info,
  ArrowLeft,
  Thermometer,
  Wind,
  Cloud,
  Sprout,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Farm {
  _id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
}

export default function ExploreID({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [farm, setFarm] = useState<Farm | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 📦 Lấy thông tin nông trại theo ID
  useEffect(() => {
    const fetchFarmById = async () => {
      try {
        const res = await fetch(`http://localhost:3003/agriculture/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy nông trại");
        const data = await res.json();
        setFarm(data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu nông trại:", error);
      }
    };
    fetchFarmById();
  }, [id]);

  // 🌦️ Lấy thông tin thời tiết theo tọa độ
  useEffect(() => {
    const fetchWeather = async () => {
      if (!farm) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WEATHER_API}?lat=${farm.latitude}&lon=${farm.longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric&lang=vi`
        );
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thời tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [farm]);

  // 🌿 Sinh độ ẩm đất giả lập
  const soilHumidity = weather ? Math.min(100, Math.max(20, weather.main?.humidity - 10 + Math.random() * 15)) : null;

  // 🌾 Gợi ý chăm sóc cây trồng
  const careSuggestion = () => {
    if (!weather) return "Chưa có dữ liệu";
    const temp = weather.main.temp;
    const hum = weather.main.humidity;

    if (temp > 35) return "🌞 Nhiệt độ cao! Hãy tưới thêm nước và che nắng cho cây.";
    if (temp < 20) return "❄️ Trời lạnh, nên hạn chế tưới nhiều và giữ ấm cho rễ cây.";
    if (hum < 40) return "💧 Độ ẩm thấp, cần tưới thêm để giữ ẩm cho đất.";
    return "🌿 Thời tiết lý tưởng! Cây trồng đang phát triển tốt.";
  };

  // 🌀 Hiển thị khi tải
  if (loading || !farm) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid mb-4"></div>
        <p className="text-green-600 font-semibold text-lg">
          Đang tải dữ liệu nông trại...
        </p>
      </div>
    );
  }

  // 🌳 Giao diện hiển thị
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center p-8">
      {/* 🔙 Nút quay lại */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-green-700 hover:text-green-900 font-semibold transition"
      >
        <ArrowLeft size={20} />
        Quay lại danh sách
      </button>

      {/* 🌾 Thông tin nông trại */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 border border-green-200"
      >
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          🌾 Thông Tin Nông Trại
        </h1>

        {farm.image && (
          <img
            src={farm.image}
            alt={farm.name}
            className="w-full h-64 object-cover rounded-xl mb-6 shadow-md hover:scale-[1.02] transition-transform duration-300"
          />
        )}

        <div className="space-y-4 text-green-900">
          <p className="flex items-center gap-2 text-lg">
            <MapPin className="text-green-600" size={20} />
            <strong>Tên:</strong> {farm.name}
          </p>
          <p className="flex items-center gap-2">
            <Info className="text-green-600" size={20} />
            <strong>Địa chỉ:</strong> {farm.location}
          </p>
          <p className="leading-relaxed">
            <strong>Mô tả:</strong> {farm.description}
          </p>
        </div>

        {/* 🌤️ Khu vực chỉ số môi trường */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
          >
            <EnvCard icon={<Thermometer />} label="Nhiệt độ" value={`${weather.main.temp}°C`} />
            <EnvCard icon={<Droplets />} label="Độ ẩm không khí" value={`${weather.main.humidity}%`} />
            <EnvCard icon={<Wind />} label="Gió" value={`${weather.wind.speed} m/s`} />
            <EnvCard icon={<Cloud />} label="Trạng thái" value={weather.weather?.[0]?.description ?? "N/A"} />
          </motion.div>
        )}

        {/* 🌱 Thông tin phụ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 bg-green-50 p-5 rounded-2xl shadow-inner text-center"
        >
          <p className="text-lg font-semibold text-green-800 flex justify-center items-center gap-2">
            <Sprout size={22} className="text-green-600" /> Gợi ý chăm sóc:
          </p>
          <p className="mt-2 text-green-700">{careSuggestion()}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// 🌤️ Component thẻ chỉ số môi trường
function EnvCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-green-100 rounded-2xl p-4 shadow-md text-center flex flex-col justify-center items-center"
    >
      <div className="text-green-600 mb-2">{icon}</div>
      <p className="font-semibold text-green-800">{label}</p>
      <p className="text-xl font-bold text-green-700">{value}</p>
    </motion.div>
  );
}
