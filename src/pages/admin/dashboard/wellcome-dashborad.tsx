import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "antd";
import { Sun, Moon, MapPin, Leaf, Snowflake, Flower } from "lucide-react";
import Lottie from "lottie-react";
import cherryBlossomAnimation from "@/assets/cherry_blossom.json"; // Thêm hiệu ứng hoa đào

import wooly_logo from "@/assets/images/wooly_logo.png";
import vietnam_flag from "@/assets/images/vietnam_flag .jpg";

const WellcomeDashborad = () => {
  const [loiChao, setLoiChao] = useState("Chào buổi chiều");
  const [icon, setIcon] = useState(<Sun className="w-6 h-6 text-yellow-500" />);
  const [thoiGian, setThoiGian] = useState(new Date());
  const [viTri, setViTri] = useState("Đang tải...");
  const [tenNguoiDung, setTenNguoiDung] = useState("Admin");
  const [mua, setMua] = useState(" Mùa Xuân");
  const [iconMua, setIconMua] = useState(<Flower className="w-5 h-5 text-pink-400" />);

  useEffect(() => {
    const duLieuAuth = localStorage.getItem("auth-store");
    if (duLieuAuth) {
      try {
        const duLieuParsed = JSON.parse(duLieuAuth);
        const ten = duLieuParsed?.state?.user?.data?.name || "Admin";
        setTenNguoiDung(ten);
      } catch (error) {
        console.error("Lỗi parse auth-store:", error);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const hienTai = new Date();
      setThoiGian(hienTai);
      const gio = hienTai.getHours();

      if (gio >= 6 && gio < 12) {
        setLoiChao("Good morning");
        setIcon(<Sun className="w-6 h-6 text-yellow-500" />);
      } else if (gio >= 18 || gio < 6) {
        setLoiChao("Good night");
        setIcon(<Moon className="w-6 h-6 text-blue-500" />);
      } else {
        setLoiChao("Good afternoon");
        setIcon(<Sun className="w-6 h-6 text-orange-500" />);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              setViTri(data.address.city || data.address.town || "Không xác định");
            })
            .catch(() => setViTri("Không xác định"));
        },
        () => setViTri("Vị trí bị từ chối")
      );
    }
  }, []);

  useEffect(() => {
    const thang = new Date().getMonth() + 1;

    if (thang >= 3 && thang <= 5) {
      setMua("Mùa Xuân");
      setIconMua(<Flower className="w-5 h-5 text-pink-400" />);
    } else if (thang >= 6 && thang <= 8) {
      setMua(" Mùa Hè");
      setIconMua(<Sun className="w-5 h-5 text-yellow-500" />);
    } else if (thang >= 9 && thang <= 11) {
      setMua(" Mùa Thu");
      setIconMua(<Leaf className="w-5 h-5 text-orange-500" />);
    } else {
      setMua("Mùa Đông");
      setIconMua(<Snowflake className="w-5 h-5 text-blue-500" />);
    }
  }, []);

  return (
    <div className="relative col-span-4">
      {/* Hiệu ứng hoa đào bay */}
      <Lottie
        animationData={cherryBlossomAnimation}
        loop
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <Card className="relative w- h-full px-4 shadow-md bg-white bg-opacity-80 ">
        <CardContent className="p-0">
          <div>
            <div className="w-full flex justify-center">
              <img src={vietnam_flag} alt="Cờ Việt Nam" className="w-full max-w-[400px] h-auto object-contain" />
            </div>
            <div className="flex justify-center">
              <Avatar size={84} src={wooly_logo} />
            </div>
            <div className="text-center items-center">
              <div className="flex justify-center items-center space-x-2">
                {icon}
                <span className="text-yellow-600 text-xl font-serif">{loiChao}, </span>
                <span className="text-green-400 font-semibold text-xl">{tenNguoiDung}</span>
              </div>

              <div className="mt-2 text-gray-600 text-sm">
                {thoiGian.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="flex justify-center items-center space-x-3 mt-2">
                <p className="text-gray-500 text-sm">{thoiGian.toLocaleTimeString()}</p>
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{viTri}</span>
                </div>
              </div>

              {/* Mùa và icon mùa */}
              <div className="flex justify-center items-center pb-16 mt-2">
                {iconMua}
                <span className="ml-2 text-gray-700 text-sm font-semibold">{mua}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellcomeDashborad;
