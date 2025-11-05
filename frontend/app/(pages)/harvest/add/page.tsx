"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, BookOpen, Calendar, FileText } from "lucide-react";

export default function AddCropPage() {
  const router = useRouter();
  const [cropData, setCropData] = useState({
    name: "",
    scientificName: "",
    startDate: "",
    expectedHarvest: "",
    note: "",
  });

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3003/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cropData),
      });
      if (!res.ok) throw new Error("Lỗi tạo cây trồng");
      router.push("/harvest");
    } catch (err) {
      console.error(err);
      alert("Không thể lưu cây trồng");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-green-200">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center animate-pulse drop-shadow">
          🌿 Thêm cây trồng mới
        </h2>

        <div className="space-y-4">
          {/* Tên cây */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <Leaf className="w-5 h-5 text-green-500 mr-2" />
            <input
              className="w-full focus:outline-none bg-transparent placeholder-gray-400 text-gray-800"
              placeholder="Tên cây"
              value={cropData.name}
              onChange={(e) => setCropData({ ...cropData, name: e.target.value })}
            />
          </div>

          {/* Tên khoa học */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <BookOpen className="w-5 h-5 text-green-500 mr-2" />
            <input
              className="w-full focus:outline-none bg-transparent placeholder-gray-400 text-gray-800"
              placeholder="Tên khoa học"
              value={cropData.scientificName}
              onChange={(e) => setCropData({ ...cropData, scientificName: e.target.value })}
            />
          </div>

          {/* Ngày gieo */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <Calendar className="w-5 h-5 text-green-500 mr-2" />
            <input
              className="w-full focus:outline-none bg-transparent text-gray-800"
              type="date"
              value={cropData.startDate}
              onChange={(e) => setCropData({ ...cropData, startDate: e.target.value })}
            />
          </div>

          {/* Ngày thu hoạch */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <Calendar className="w-5 h-5 text-green-500 mr-2" />
            <input
              className="w-full focus:outline-none bg-transparent text-gray-800"
              type="date"
              value={cropData.expectedHarvest}
              onChange={(e) => setCropData({ ...cropData, expectedHarvest: e.target.value })}
            />
          </div>

          {/* Ghi chú */}
          <div className="flex items-start border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 transition">
            <FileText className="w-5 h-5 text-green-500 mr-2 mt-1" />
            <textarea
              className="w-full focus:outline-none bg-transparent text-gray-800 resize-none placeholder-gray-400"
              placeholder="Ghi chú"
              value={cropData.note}
              onChange={(e) => setCropData({ ...cropData, note: e.target.value })}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl transition-transform hover:scale-105"
            onClick={() => router.push("/harvest")}
          >
            Hủy
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition-transform hover:scale-105 flex items-center gap-2"
            onClick={handleSave}
          >
            🌱 Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
