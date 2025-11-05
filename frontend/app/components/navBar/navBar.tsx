"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/explore", label: "Bản đồ" },
    { href: "/plantAI", label: "PlantAI" },
    { href: "/stats", label: "Thống kê" },
    { href: "/weather", label: "Dự báo thời tiết" },
    { href: "/harvest", label: "Quản lý mùa vụ" },
    { href: "/plantDiseases", label: "Dự đoán bệnh" },
    { href: "/instruction", label: "Hướng dẫn chăm sóc" },
    

  ];

  const isActive = (href) => pathname === href;

  // Demo: user chưa đăng nhập
  const user = null;

  return (
    <header className="w-full bg-green-600 shadow-sm sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (trang chủ) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              🌱 Trang chủ
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-green-200 transition-colors ${
                  isActive(item.href) ? "underline" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Authentication buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/dang-nhap"
                  className="px-3 py-1 rounded-md border border-white hover:bg-white hover:text-green-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/dang-ky"
                  className="px-3 py-1 rounded-md bg-white text-green-600 hover:bg-green-100 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-green-500"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-max-height duration-300 ease-in-out overflow-hidden bg-green-600 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md hover:bg-green-500 ${
                isActive(item.href) ? "underline" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Authentication buttons */}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3 py-2">
              <Link
                href="/dang-nhap"
                className="block px-3 py-1 rounded-md border border-white hover:bg-white hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="block px-3 py-1 rounded-md bg-white text-green-600 hover:bg-green-100 transition-colors"
                onClick={() => setOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
