import { useNavigate } from "react-router";
import { LayoutDashboard, ArrowRight, QrCode } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto">
            <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-light tracking-tight">
            Djanam
          </h1>
          <p className="text-gray-400 text-sm">
            Steak <span className="text-red-500">&</span> Fish
          </p>
        </div>

        <div
          className="bg-[#111] rounded-xl border border-[#222] p-5 cursor-pointer hover:border-[#333] transition-colors"
          onClick={() => navigate("/admin")}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Админ Панел</p>
              <p className="text-xs text-gray-500">Управление на меню, маси и аналитика</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#222] p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Клиентско Меню</p>
              <p className="text-xs text-gray-500">Сканирайте QR кода на Вашата маса</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-6 flex flex-col items-center gap-3 border border-[#222]">
            <QrCode className="w-16 h-16 text-[#333]" />
            <p className="text-xs text-gray-600 text-center">
              Поставете QR кода на масата върху камерата
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          Djanam Steak & Fish | Digital Menu System
        </p>
      </div>
    </div>
  );
}
