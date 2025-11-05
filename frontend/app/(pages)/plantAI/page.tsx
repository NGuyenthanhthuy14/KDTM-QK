"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function PlantAI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll tự động xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg: Message = { sender: "user", text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    fetch("https://thuyxinh.app.n8n.cloud/webhook/plant-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    })
      .then(async r => {
        // Lấy text trước, để kiểm tra xem có JSON hợp lệ không
        const text = await r.text();
        try {
          const data = JSON.parse(text);
          return data;
        } catch {
          // Nếu không parse được, trả về text thẳng
          return { result: text };
        }
      })
      .then(data => {
        const aiMsg: Message = { sender: "ai", text: data.result || "Không có phản hồi từ AI." };
        setMessages(prev => [...prev, aiMsg]);
      })
      .catch(err => {
        console.error("Lỗi khi gọi n8n:", err);
        const aiMsg: Message = { sender: "ai", text: "⚠️ Lỗi kết nối tới AI hoặc n8n." };
        setMessages(prev => [...prev, aiMsg]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        🌱 Plant AI Chatbot
      </h1>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border-2 border-green-200 flex flex-col h-[600px]">
        {/* Chat area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl break-words ${
                  msg.sender === "user" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-green-200 flex gap-2">
          <textarea
            placeholder="Nhập câu hỏi về cây trồng, sâu bệnh, mùa vụ..."
            className="flex-1 p-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>

      <p className="text-green-800 mt-4 text-center">
        Hỏi PlantAI về cây trồng, mùa vụ và dự báo nông nghiệp.
      </p>
    </div>
  );
}
