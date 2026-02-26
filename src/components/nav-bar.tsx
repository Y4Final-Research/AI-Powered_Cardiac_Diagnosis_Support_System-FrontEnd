
"use client";
import Link from "next/link";
import { Heart, User, LogOut } from "lucide-react";
import { FC } from "react";

interface NavBarProps {
	userName: string;
	handleLogout: () => void;
}

export const NavBar: FC<NavBarProps> = ({ userName, handleLogout }) => {
	return (
		<nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
						<Heart className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold text-slate-900">CardiAI</span>
				</Link>

				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
						<User className="w-5 h-5 text-slate-700" />
						<span className="text-slate-900 font-medium">{userName}</span>
					</div>
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-red-600 font-medium transition-colors"
					>
						<LogOut className="w-5 h-5" />
						<span className="hidden sm:inline">Logout</span>
					</button>
				</div>
			</div>
		</nav>
	);
};
