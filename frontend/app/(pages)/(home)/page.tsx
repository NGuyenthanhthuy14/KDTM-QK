import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Ảnh nền full */}
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        className="object-cover"
      />

      {/* Overlay tối mờ */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
        <h1
          className="text-white text-5xl md:text-6xl font-bold mb-6 fade-up"
          style={{
            animationDelay: "0s",
            textShadow: "0 0 10px rgba(0,255,0,0.7), 0 0 20px rgba(0,255,0,0.5)",
          }}
        >
          Chào mừng đến với hệ thống quản lý mùa vụ
        </h1>
        <p
          className="text-white text-lg md:text-2xl mb-8 fade-up"
          style={{
            animationDelay: "0.3s",
            textShadow: "0 0 8px rgba(0,255,0,0.6), 0 0 15px rgba(0,255,0,0.4)",
          }}
        >
          Khám phá những trải nghiệm tuyệt vời cùng chúng tôi
        </p>

        <Link href="/explore">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full text-lg btn-hover fade-up"
            style={{
              animationDelay: "0.6s",
              boxShadow: "0 0 15px rgba(0,255,0,0.7), 0 0 30px rgba(0,255,0,0.5)",
            }}
          >
            Khám phá ngay
          </button>
        </Link>
      </div>
    </div>
  );
}
