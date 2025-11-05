"use client";

import { useState, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ForecastDay {
  date: string;
  avgTemp: number;
  humidity: number;
  description: string;
  icon: string;
  weekday: string;
}

export default function WeatherPage() {
  const [viewState, setViewState] = useState({
    longitude: 105.8342, // Hà Nội
    latitude: 21.0278,
    zoom: 6,
  });

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  // Fetch weather khi viewState thay đổi
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WEATHER_API}?lat=${viewState.latitude}&lon=${viewState.longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric&lang=vi`
        );
        const data = await res.json();
        setWeather(data);

        const res2 = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${viewState.latitude}&lon=${viewState.longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric&lang=vi`
        );
        const data2 = await res2.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const grouped: Record<string, any> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data2.list.forEach((item: any) => {
          const dateObj = new Date(item.dt * 1000);
          const date = dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
          const weekday = dateObj.toLocaleDateString("vi-VN", { weekday: "long" });

          if (!grouped[date]) {
            grouped[date] = {
              date,
              weekday,
              tempSum: 0,
              humiditySum: 0,
              count: 0,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            };
          }

          grouped[date].tempSum += item.main.temp;
          grouped[date].humiditySum += item.main.humidity;
          grouped[date].count++;
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dailyData = Object.entries(grouped).map(([date, val]: any) => ({
          date,
          weekday: val.weekday,
          avgTemp: Math.round(val.tempSum / val.count),
          humidity: Math.round(val.humiditySum / val.count),
          description: val.description,
          icon: val.icon,
        }));

        setForecast(dailyData.slice(0, 5));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
      }
    };

    fetchWeather();
  }, [viewState]);

  // Tìm kiếm địa điểm
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
        setViewState((prev) => ({ ...prev, longitude: lon, latitude: lat, zoom: 8 }));
      } else {
        alert("Không tìm thấy địa điểm!");
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Bản đồ */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
        {/* Thanh tìm kiếm */}
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

        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <NavigationControl position="top-right" />
          <Marker longitude={viewState.longitude} latitude={viewState.latitude} color="green" />
        </Map>
      </div>

      {/* Thông tin thời tiết */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex flex-col justify-start items-center p-6 shadow-lg overflow-y-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Dự báo thời tiết</h1>

        {weather ? (
          <>
            <p className="text-gray-800 text-lg mb-2">📍 {weather.name ?? "Không rõ vị trí"}</p>
            <p className="text-5xl font-semibold text-green-700 mb-2">
              🌡️ {Math.round(weather?.main?.temp) ?? "--"}°C
            </p>
            <p className="text-gray-700 mb-2 capitalize">{weather?.weather?.[0]?.description ?? "Đang tải..."}</p>
            <p className="text-gray-700">💧 Độ ẩm: {weather?.main?.humidity ?? "--"}%</p>
            <p className="text-gray-700">🌬️ Gió: {weather?.wind?.speed ?? "--"} m/s</p>
          </>
        ) : (
          <p className="text-gray-500">Đang tải dữ liệu thời tiết...</p>
        )}

        {/* Dự báo 5 ngày */}
        {forecast.length > 0 && (
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">🌤️ Dự báo 5 ngày tới</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="border rounded-2xl bg-linear-to-b from-green-50 to-white shadow-md hover:shadow-lg transition-all duration-300 p-4 text-center"
                >
                  <p className="font-semibold text-green-700 text-lg capitalize">{day.weekday}</p>
                  <p className="text-gray-500 text-sm mb-2">{day.date}</p>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                    className="w-16 h-16 mx-auto"
                  />

                  <p className="capitalize text-gray-800 mb-2">{day.description}</p>
                  <p className="text-xl font-semibold text-green-700">🌡️ {day.avgTemp}°C</p>
                  <p className="text-gray-600">💧 {day.humidity}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
