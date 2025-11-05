"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Leaf, Cloud, Activity, NotebookPen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CropManager() {
  const [crops, setCrops] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

	useEffect(() => {
		const fetchCrops = async () => {
			try {
				const res = await fetch('http://localhost:3003/crop');
				if (!res.ok) throw new Error('Network response was not ok');
				const data = await res.json();
				setCrops(data);
			} catch (err) {
				console.error('Lỗi fetch crops:', err);
			}
		};
		fetchCrops();
	}, []);

  // --- Tính tiến độ dựa trên ngày gieo và thu hoạch ---
  const calculateProgress = (crop) => {
    if (!crop.startDate || !crop.expectedHarvest) return 0;
    const start = new Date(crop.startDate).getTime();
    const end = new Date(crop.expectedHarvest).getTime();
    const now = Date.now();
    if (now < start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const updateStatusByProgress = (progress) => {
    if (progress === 0) return "Chưa gieo";
    if (progress < 25) return "Mới gieo";
    if (progress < 50) return "Sinh trưởng sớm";
    if (progress < 75) return "Đang sinh trưởng";
    if (progress < 100) return "Gần thu hoạch";
    return "Đã thu hoạch";
  };

  // --- Lấy dữ liệu thời tiết ---
  const fetchWeather = async (lat = 21.0285, lon = 105.8542) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`
      );
      const data = await res.json();
      return {
        temp: data.main.temp,
        humidity: data.main.humidity,
        rain: data.rain?.["1h"] || 0,
        description: data.weather[0]?.description || "Không có dữ liệu",
      };
    } catch (err) {
      console.error("Lỗi lấy thời tiết:", err);
      return { temp: 0, humidity: 0, rain: 0, description: "Lỗi API" };
    }
  };

  // --- Cập nhật tiến độ & trạng thái mỗi phút ---
  useEffect(() => {
    const updateAllProgress = () => {
      setCrops(prev =>
        prev.map(c => {
          const newProgress = calculateProgress(c);
          return { ...c, progress: newProgress, status: updateStatusByProgress(newProgress) };
        })
      );
    };
    updateAllProgress();
    const interval = setInterval(updateAllProgress, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Cập nhật thời tiết cho cây chọn ---
  useEffect(() => {
    const updateWeather = async () => {
      if (!selectedCrop) return;
      const weather = await fetchWeather();
      setCrops(prev => prev.map(c => (c.id === selectedCrop.id ? { ...c, weather } : c)));
    };
    updateWeather();
    const interval = setInterval(updateWeather, 3600000);
    return () => clearInterval(interval);
  }, [selectedCrop]);

  // --- Nhật ký ---
  const addLog = () => {
    const action = prompt("Hành động (Bón phân, tưới nước...):");
    if (!action) return;
    const note = prompt("Ghi chú chi tiết:") || "";
    const date = new Date().toISOString().split("T")[0];
    setLogs([{ id: Date.now(), action, note, date }, ...logs]);
  };

  // --- Popup chỉnh sửa ---
  const openEditModal = (crop) => { setEditData({ ...crop }); setIsModalOpen(true); };
  const saveEdit = () => { setCrops(prev => prev.map(c => c.id === editData.id ? { ...editData } : c)); setSelectedCrop(editData); setIsModalOpen(false); };

  // --- Xóa cây ---
  const deleteCrop = (id) => {
    if (!confirm("Xóa cây trồng này?")) return;
    const newList = crops.filter(c => c.id !== id);
    setCrops(newList);
    setSelectedCrop(newList[0] || null);
  };

  // --- Biểu đồ năng suất ---
  const yieldData = [
    { month: "Tháng 1", yield: 0 },
    { month: "Tháng 2", yield: 1 },
    { month: "Tháng 3", yield: 2.5 },
    { month: "Tháng 4", yield: 4.8 },
    { month: "Tháng 5", yield: selectedCrop?.yieldPredicted || 6 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Danh sách cây trồng */}
      <div className="w-1/3 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-green-700">🌿 Danh sách cây trồng</h2>
          <button
            onClick={() => {
              const name = prompt("Tên cây trồng:");
              if (!name) return;
              const newCrop = { id: Date.now(), name, scientificName: "", startDate: "", expectedHarvest: "", note: "", status: "Chưa trồng", growthStage: "", progress: 0 };
              setCrops([...crops, newCrop]);
              setSelectedCrop(newCrop);
            }}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
          ><Plus size={16}/> Thêm</button>
        </div>
        <ul className="space-y-2 overflow-y-auto">
          {crops.map((crop, index) => (
            <li key={index} onClick={() => setSelectedCrop(crop)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedCrop?.id === crop.id ? "bg-green-100 text-green-700 font-medium" : "hover:bg-gray-100"}`}>
              <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-green-600" /><span>{crop.name}</span></div>
              <span className="text-xs text-gray-500">{crop.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chi tiết cây trồng */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedCrop ? (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-1">{selectedCrop.name}</h2>
              <p className="text-gray-500 italic mb-3">{selectedCrop.scientificName || "Chưa có tên khoa học"}</p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div><p className="text-sm text-gray-500">🌱 Ngày gieo</p><p>{selectedCrop.startDate || "—"}</p></div>
                <div><p className="text-sm text-gray-500">🌾 Dự kiến thu hoạch</p><p>{selectedCrop.expectedHarvest || "—"}</p></div>
                <div><p className="text-sm text-gray-500">📊 Trạng thái</p><p>{selectedCrop.status}</p></div>
                <div><p className="text-sm text-gray-500">🌿 Giai đoạn</p><p>{selectedCrop.growthStage || "—"}</p></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">📈 Tiến độ sinh trưởng</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${selectedCrop.progress}%` }}></div>
                </div>
                <p className="text-xs text-right text-gray-500 mt-1">{selectedCrop.progress}%</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2"><Cloud size={18}/> Dữ liệu thời tiết & Dự báo</h3>
              <div className="grid md:grid-cols-3 gap-2 text-sm">
                <p>🌡 Nhiệt độ: <b>{selectedCrop.weather?.temp?.toFixed(1)}°C</b></p>
                <p>💧 Độ ẩm: <b>{selectedCrop.weather?.humidity?.toFixed(0)}%</b></p>
                <p>🌧 Lượng mưa: <b>{selectedCrop.weather?.rain} mm</b></p>
              </div>
              {selectedCrop.weather?.rain > 0 && <p className="text-blue-600 text-sm mt-1">💡 Gợi ý: Có mưa, nên tạm ngừng tưới nước hôm nay.</p>}
            </div>

            <div>
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2"><Activity size={18}/> Biểu đồ năng suất dự kiến</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2"><NotebookPen size={18}/> Nhật ký mùa vụ</h3>
              <button onClick={addLog} className="mb-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg">➕ Thêm nhật ký</button>
              <ul className="space-y-2 text-sm">
                {logs.length === 0 ? <li className="text-gray-400 italic">Chưa có hoạt động nào.</li> :
                  logs.map(log => <li key={log.id} className="border-b border-gray-200 pb-1">📅 <b>{log.date}</b> – {log.action}: {log.note}</li>)
                }
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => openEditModal(selectedCrop)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"><Pencil size={16}/> Cập nhật</button>
              <button onClick={() => deleteCrop(selectedCrop.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"><Trash2 size={16}/> Xóa</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic text-center mt-10">🌿 Hãy chọn một loại cây để xem chi tiết.</p>
        )}
      </div>

      {/* Popup chỉnh sửa cây */}
      {isModalOpen && selectedCrop && (
        <div className="fixed inset-0 bg-gray-5000 bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>✖</button>
            <h2 className="text-xl font-bold text-green-700 mb-4">Cập nhật cây trồng</h2>
            <div className="space-y-3">
              <input className="w-full border rounded px-3 py-1" placeholder="Tên cây" value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              <input className="w-full border rounded px-3 py-1" placeholder="Tên khoa học" value={editData.scientificName || ""} onChange={(e) => setEditData({ ...editData, scientificName: e.target.value })} />
              <input className="w-full border rounded px-3 py-1" type="date" placeholder="Ngày gieo" value={editData.startDate || ""} onChange={(e) => setEditData({ ...editData, startDate: e.target.value })} />
              <input className="w-full border rounded px-3 py-1" type="date" placeholder="Dự kiến thu hoạch" value={editData.expectedHarvest || ""} onChange={(e) => setEditData({ ...editData, expectedHarvest: e.target.value })} />
              <input className="w-full border rounded px-3 py-1" placeholder="Trạng thái" value={editData.status || ""} onChange={(e) => setEditData({ ...editData, status: e.target.value })} />
              <input className="w-full border rounded px-3 py-1" placeholder="Giai đoạn phát triển" value={editData.growthStage || ""} onChange={(e) => setEditData({ ...editData, growthStage: e.target.value })} />
              <input className="w-full border rounded px-3 py-1" placeholder="Tiến độ (%)" type="number" value={editData.progress || 0} onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) || 0 })} />
              <textarea className="w-full border rounded px-3 py-1" placeholder="Ghi chú" value={editData.note || ""} onChange={(e) => setEditData({ ...editData, note: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded" onClick={() => setIsModalOpen(false)}>Hủy</button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded" onClick={saveEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
