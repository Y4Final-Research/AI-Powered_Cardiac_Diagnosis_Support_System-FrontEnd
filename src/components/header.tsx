"use client";

import { useRouter } from "next/navigation";
import { Heart, LogOut, User } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
  onLogin: () => void;
}

export default function Header({
  isLoggedIn,
  userName = "User",
  onLogout,
  onLogin,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-cyan-400/20 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <Heart className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CardiAI</h1>
            <p className="text-xs text-cyan-600 font-medium">Diagnostic System</p>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-cyan-400/20 rounded-lg">
                <User className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-slate-700">{userName}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
