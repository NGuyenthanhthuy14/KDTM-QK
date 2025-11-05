"use client";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  channel?: string;
};

export default function Instruction() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setVideos([]);

    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(query)}`);
      const text = await res.text();

      if (!res.ok) {
        console.error("API lỗi:", res.status, text);
        throw new Error(`API trả về mã ${res.status}`);
      }

      const data = JSON.parse(text);
      const items =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.items?.map((it: any) => ({
          id: it.id?.videoId ?? it.id,
          title: it.snippet?.title ?? "Không có tiêu đề",
          thumbnail: it.snippet?.thumbnails?.medium?.url ?? "",
          description: it.snippet?.description ?? "",
          channel: it.snippet?.channelTitle ?? "Không rõ kênh",
        })) ?? [];

      if (!items.length) setError("Không tìm thấy video phù hợp.");
      setVideos(items);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setError("Lỗi khi tìm video. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-6">
      {/* Tiêu đề */}
      <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-700 drop-shadow-sm">
        🌱 Video Hướng Dẫn Chăm Sóc Cây Trồng
      </h2>

      {/* Ô tìm kiếm */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ khóa... ví dụ: chăm sóc cà chua 🍅"
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl shadow-md hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Đang tìm...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" /> Tìm kiếm
            </>
          )}
        </button>
      </div>

      {/* Lỗi */}
      {error && (
        <div className="text-red-700 text-center font-medium mb-6 bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Danh sách video */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((v) => (
          <article
            key={v.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="aspect-video bg-gray-100">
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-2 text-lg">
                {v.title}
              </h3>
              <p className="text-sm text-emerald-600 mt-1">{v.channel}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {v.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Gợi ý */}
      {!loading && videos.length === 0 && !error && (
        <p className="text-center text-gray-600 mt-10 italic text-lg">
          💡 Gợi ý: “chăm sóc cà chua”, “phòng trừ sâu bệnh táo”, “bón phân xoài”.
        </p>
      )}
    </div>
  );
}
