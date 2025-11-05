"use client";

import { useEffect, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Leaf } from "lucide-react";
import Link from "next/link";


interface Farm {
  _id: string;
  name?: string;
  location?: string;
  description?: string;
  owner_name?: string;
  contact_info?: string;
  longitude: number;
  latitude: number;
}

export default function Explore() {
  const [viewState, setViewState] = useState({
    longitude: 105.8342, // Hà Nội
    latitude: 21.0278,
    zoom: 5,
    transitionDuration: 800, // 🆕 thời gian chuyển mượt mà
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);


  // 📦 Lấy danh sách nông trại
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await fetch("http://localhost:3003/agriculture");
        const data = await res.json();
        setFarms(data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu nông trại:", error);
      }
    };
    fetchFarms();
  }, []);

  // 🔍 Xử lý tìm kiếm địa điểm
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lon, lat] = data.features[0].center;
        setViewState((prev) => ({
          ...prev,
          longitude: lon,
          latitude: lat,
          zoom: 12,
        }));
      } else {
        alert("Không tìm thấy địa điểm!");
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* 🔍 Thanh tìm kiếm */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex shadow-lg bg-white rounded-xl overflow-hidden">
        <input
          type="text"
          className="px-4 py-2 w-80 focus:outline-none"
          placeholder="Tìm địa điểm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
          onClick={handleSearch}
        >
          Tìm
        </button>
      </div>

      {/* 🗺️ Bản đồ */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {/* 🟢 Hiển thị tất cả điểm nông trại */}
        {farms.map((farm, index) => (
          <Marker
            key={`${farm._id}-${index}`}
            longitude={farm.longitude}
            latitude={farm.latitude}
            color="green"
            onClick={(e) => {
              e.originalEvent.stopPropagation();

              // 👉 Khi click marker thì zoom đến vị trí đó
              setViewState((prev) => ({
                ...prev,
                longitude: farm.longitude,
                latitude: farm.latitude,
                zoom: 12,
                transitionDuration: 1000,
              }));

              setSelectedFarm(farm);
            }}
          />
        ))}

        {/* 💬 Hiển thị popup khi click */}
        {selectedFarm && (
          <Popup
            longitude={selectedFarm.longitude}
            latitude={selectedFarm.latitude}
            onClose={() => setSelectedFarm(null)}
            closeOnClick={false}
            anchor="top"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 w-64 border border-green-100 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Leaf className="text-green-600 w-4 h-4" />
                </div>
                <h3 className="font-semibold text-green-700 text-base">
                  {selectedFarm.name || "Nông trại không tên"}
                </h3>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-green-600">📍 Địa điểm:</span>{" "}
                  {selectedFarm.location || "Chưa có địa chỉ"}
                </p>
                <p>
                  <span className="font-medium text-green-600">🌱 Loại cây:</span>{" "}
                  {selectedFarm.description || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-green-600">👩‍🌾 Chủ trại:</span>{" "}
                  {selectedFarm.owner_name || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-green-600">📞 Liên hệ:</span>{" "}
                  {selectedFarm.contact_info || "Không rõ"}
                </p>
              </div>

              <div className="mt-3 flex justify-end">
                <Link
                  href={`/explore/${selectedFarm._id}`}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded-full transition"
                >
                  Xem chi tiết
                </Link>
              </div>


            </div>
          </Popup>

          
        )}
      </Map>
    </div>
  );
}
