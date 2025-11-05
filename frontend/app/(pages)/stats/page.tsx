"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Leaf,
  TrendingUp,
  BarChart3,
  LineChart as LineChartIcon,
  AlertCircle,
} from "lucide-react";

export default function StatsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"count" | "yield">("count");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  // --- Gọi dữ liệu ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://thuyxinh.app.n8n.cloud/webhook/thongke");
        const json = await res.json();

        const normalized = Array.isArray(json)
          ? json
          : json && typeof json === "object"
          ? [json]
          : [];

        const currentMonth = new Date().getMonth() + 1;
        const filtered = normalized.filter((item) => {
          const monthNum = parseInt(item.month?.replace("Tháng ", "") || "0");
          return monthNum <= currentMonth;
        });

        filtered.sort((a, b) => {
          const mA = parseInt(a.month?.replace("Tháng ", "") || "0");
          const mB = parseInt(b.month?.replace("Tháng ", "") || "0");
          return mA - mB;
        });

        setData(filtered);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleModeChange = (_: any, newMode: "count" | "yield") => {
    if (newMode) setMode(newMode);
  };

  const handleChartChange = (_: any, newType: "bar" | "line") => {
    if (newType) setChartType(newType);
  };

  const chartData = data.map((item) => ({
    month: item.month,
    value: mode === "count" ? item.count : item.totalYield,
  }));

  // --- Tính toán tổng quan ---
  const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);
  const peak =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.value > b.value ? a : b))
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 p-8">
      {/* --- Tiêu đề --- */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold text-green-700 flex items-center justify-center gap-3">
          <Leaf className="w-8 h-8 text-green-600 animate-pulse" />
          Thống kê mùa vụ theo tháng
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Biểu đồ hiển thị số vụ gieo trồng và sản lượng trong năm
        </p>
      </motion.div>

      {/* --- Tổng quan nhanh --- */}
      {!loading && chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          <Card className="p-4 bg-white/80 border-green-200 rounded-2xl shadow-md w-60 text-center">
            <p className="text-green-600 font-semibold">🌱 Tổng số vụ</p>
            <p className="text-2xl font-bold text-green-700">{total}</p>
          </Card>

          <Card className="p-4 bg-white/80 border-green-200 rounded-2xl shadow-md w-60 text-center">
            <p className="text-green-600 font-semibold">📅 Tháng cao điểm</p>
            <p className="text-2xl font-bold text-green-700">
              {peak ? peak.month : "-"}
            </p>
          </Card>
        </motion.div>
      )}

      {/* --- Nút chuyển chế độ --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-6 gap-6"
      >
        <ToggleButtonGroup
          color="success"
          value={mode}
          exclusive
          onChange={handleModeChange}
        >
        </ToggleButtonGroup>

        <ToggleButtonGroup
          color="success"
          value={chartType}
          exclusive
          onChange={handleChartChange}
        >
          <ToggleButton value="bar">
            <BarChart3 className="w-5 h-5 mr-1" /> Cột
          </ToggleButton>
          <ToggleButton value="line">
            <LineChartIcon className="w-5 h-5 mr-1" /> Đường
          </ToggleButton>
        </ToggleButtonGroup>
      </motion.div>

      {/* --- Biểu đồ --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="max-w-5xl mx-auto shadow-2xl rounded-3xl border border-green-200 bg-white/70 backdrop-blur-sm">
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-10">
                <CircularProgress color="success" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-lg flex justify-center items-center gap-2">
                <AlertCircle className="text-yellow-500 w-5 h-5" />
                Không có dữ liệu thống kê
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                {chartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#166534", fontWeight: 600 }}
                    />
                    <YAxis tick={{ fill: "#166534", fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f0fdf4",
                        borderRadius: "12px",
                        border: "1px solid #a7f3d0",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#22c55e"
                      radius={[10, 10, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#166534", fontWeight: 600 }}
                    />
                    <YAxis tick={{ fill: "#166534", fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f0fdf4",
                        borderRadius: "12px",
                        border: "1px solid #a7f3d0",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#16a34a" }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* --- Footer nhỏ --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8 text-gray-500 text-sm"
      >
        <TrendingUp className="inline w-4 h-4 mr-1 text-green-500" />
        Dữ liệu được cập nhật tự động từ hệ thống quản lý mùa vụ 🌾
      </motion.div>
    </div>
  );
}
