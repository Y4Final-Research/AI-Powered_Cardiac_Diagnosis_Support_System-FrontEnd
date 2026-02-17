"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Activity,
  FileText,
  Settings,
  Menu,
  X,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
    {
    id: "cardiac",
    label: "Cardiac Diagnosis",
    href: "/cardiac-diagnosis",
    icon: <Heart className="w-5 h-5" />,
    description: "AI-Powered Cardiac",
  },
  {
    id: "dashboard",
    label: "Cardiac ECG Analysis",
    href: "/ecg-analysis",
    icon: <Activity className="w-5 h-5" />,
    description: "Cardiac lab Analysis",
  },
  {
    id: "reports",
    label: "Medical Reports",
    href: "/dashboard",
    icon: <FileText className="w-5 h-5" />,
    description: "Patient History",
  },
  {
    id: "consultation",
    label: "Consultations",
    href: "/doctor",
    icon: <Stethoscope className="w-5 h-5" />,
    description: "Doctor Recommendations",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
    description: "Account & Preferences",
  },
];

interface SideNavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SideNavigation({
  isOpen = true,
  onClose,
}: SideNavigationProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get user role from localStorage (client-side only)
  let role: string | null = null;
  if (typeof window !== "undefined") {
    role = localStorage.getItem("role");
  }

  // Filter nav items based on role
  const filteredNavItems = navItems.filter((item) => {
    if (role === "patient") {
      // Hide "consultation" and "cardiac" for patients
      if (item.id === "consultation" || item.id === "cardiac") {
        return false;
      }
    } else {
      // Hide "reports" and "dashboard" for non-patients
      if (item.id === "reports" || item.id === "dashboard") {
        return false;
      }
    }
    return true;
  });

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {mobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-50 to-blue-50 border-r border-cyan-400/20 pt-20 transition-all duration-300 lg:pt-20 lg:translate-x-0 z-30 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Navigation Items */}
        <nav className="px-4 py-6 space-y-2">
          {filteredNavItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div
                className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-700"
                    : "text-slate-600 hover:bg-white/50 hover:border border-transparent"
                }`}
              >
                <div
                  className={`flex-shrink-0 mt-0.5 ${
                    isActive(item.href)
                      ? "text-cyan-600"
                      : "text-slate-500 group-hover:text-cyan-600"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isActive(item.href) ? "text-cyan-700" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {item.description}
                  </p>
                </div>
                {isActive(item.href) && (
                  <div className="flex-shrink-0 w-2 h-2 bg-cyan-500 rounded-full mt-1" />
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-4 right-4 p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-lg">
          <p className="text-xs font-semibold text-slate-700 mb-1">
            CardiAI Pro
          </p>
          <p className="text-xs text-slate-500">
            Advanced cardiac diagnostics powered by AI mathematics
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}
    </>
  );
}
