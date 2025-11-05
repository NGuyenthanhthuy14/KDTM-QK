import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo / Trang chủ */}
          <div>
            <Link href="/" className="text-2xl font-bold hover:text-green-200">
              🌱 MyProject
            </Link>
            <p className="mt-2 text-sm">Quản lý cây xanh thông minh</p>
          </div>

          {/* Link nhanh */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
              <li><Link href="/ban-do" className="hover:underline">Bản đồ</Link></li>
              <li><Link href="/chatgpt" className="hover:underline">ChatGPT</Link></li>
              <li><Link href="/chi-tiet-cay" className="hover:underline">Chi tiết cây</Link></li>
            </ul>
          </div>

          {/* Đăng nhập / Đăng ký */}
          <div>
            <h3 className="font-semibold mb-4">Tài khoản</h3>
            <ul className="space-y-2">
              <li><Link href="/dang-nhap" className="hover:underline">Đăng nhập</Link></li>
              <li><Link href="/dang-ky" className="hover:underline">Đăng ký</Link></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <p>Email: <a href="mailto:info@myproject.com" className="underline">info@myproject.com</a></p>
            <p>Hotline: <a href="tel:+84090000000" className="underline">0900 000 000</a></p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-green-200"><FaFacebookF /></a>
              <a href="#" className="hover:text-green-200"><FaTwitter /></a>
              <a href="#" className="hover:text-green-200"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-400"></div>

        {/* Bottom section */}
        <div className="mt-6 text-center text-sm">
          © {new Date().getFullYear()} MyProject. Bản quyền thuộc về Tanki.
        </div>
      </div>
    </footer>
  );
}
