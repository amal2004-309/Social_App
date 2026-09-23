import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export default function Navbar() {
    const { token, user, logOutContext } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    // Unread notifications count
    const { data: notifData } = useQuery({
        queryKey: ["unread-notifications"],
        queryFn: () => api.get("/notifications/unread-count"),
        enabled: !!token,
        refetchInterval: 30000,
    });

    const unreadCount = notifData?.data?.data?.unreadCount || 0;

    function handleLogout() {
        logOutContext();
        navigate('/login');
    }

    const isCurrent = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-40 h-14 bg-fb-surface border-b border-fb shadow-xs select-none">
            <div className="h-full px-2 sm:px-4 flex items-center justify-between">
                {/* 1. Left: Logo & Search */}
                <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-[280px]">
                    <Link
                        to="/"
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-black text-2xl tracking-tighter shadow-sm hover:opacity-95 transition shrink-0"
                    >
                        <i class="fa-brands fa-facebook-f"></i>
                    </Link>

                    <div className="relative flex-1 max-w-[220px] hidden sm:block">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-fb-secondary text-xs"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search ...."
                            className="w-full bg-fb-secondary text-fb-primary placeholder:text-fb-secondary text-xs pl-8 pr-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-fb-blue transition"
                        />
                    </div>
                </div>

                {/* 2. Center: Navigation Tabs (Desktop) */}
                {token && (
                    <nav className="hidden md:flex items-center justify-center flex-1 max-w-md h-full">
                        <Link
                            to="/"
                            className={`flex-1 h-full flex items-center justify-center relative hover:bg-fb-surface-hover rounded-xl my-1 transition ${isCurrent("/") ? "text-fb-blue" : "text-fb-secondary"
                                }`}
                            title="Home"
                        >
                            <i className="fa-solid fa-house text-xl"></i>
                            {isCurrent("/") && (
                                <div className="absolute bottom-0 left-2 right-2 h-1 bg-fb-blue rounded-t-md"></div>
                            )}
                        </Link>

                        <Link
                            to="/profile"
                            className={`flex-1 h-full flex items-center justify-center relative hover:bg-fb-surface-hover rounded-xl my-1 transition ${isCurrent("/profile") ? "text-fb-blue" : "text-fb-secondary"
                                }`}
                            title="Profile"
                        >
                            <i className="fa-solid fa-user text-xl"></i>
                            {isCurrent("/profile") && (
                                <div className="absolute bottom-0 left-2 right-2 h-1 bg-fb-blue rounded-t-md"></div>
                            )}
                        </Link>
                    </nav>
                )}

                {/* 3. Right: Quick Actions & Profile Dropdown */}
                <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-1 max-w-[280px]">
                    {token ? (
                        <>
                            {/* Dark/Light Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="w-9 h-9 rounded-full bg-fb-secondary hover:bg-fb-surface-hover text-fb-primary flex items-center justify-center transition cursor-pointer"
                                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                <i className={`fa-solid ${isDark ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-500'} text-sm`}></i>
                            </button>

                            {/* Notifications Button */}
                            <div className="relative">
                                <button
                                    className="w-9 h-9 rounded-full bg-fb-secondary hover:bg-fb-surface-hover text-fb-primary flex items-center justify-center transition cursor-pointer"
                                    title="Notifications"
                                >
                                    <i className="fa-solid fa-bell text-sm"></i>
                                </button>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>

                            {/* User Avatar & Dropdown Menu */}
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-fb cursor-pointer hover:opacity-90 transition"
                                >
                                    <img
                                        alt={user?.name || "User Avatar"}
                                        src={user?.photo || defaultAvatar}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = defaultAvatar; }}
                                    />
                                </div>

                                <ul
                                    tabIndex="-1"
                                    className="menu dropdown-content bg-fb-surface border border-fb rounded-2xl z-50 mt-2 w-64 p-2 shadow-2xl space-y-1"
                                >
                                    {/* Profile preview card */}
                                    <li className="p-2 border-b border-fb mb-1">
                                        <Link to="/profile" className="flex items-center gap-3 p-1 rounded-xl">
                                            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-fb shrink-0">
                                                <img
                                                    src={user?.photo || defaultAvatar}
                                                    alt={user?.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-bold text-sm text-fb-primary truncate">{user?.name || 'My Profile'}</h5>
                                                <p className="text-xs text-fb-secondary truncate">See your profile</p>
                                            </div>
                                        </Link>
                                    </li>

                                    <li>
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center justify-between text-xs font-medium text-fb-primary py-2.5 rounded-xl hover:bg-fb-secondary"
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
                                                Display (Dark Mode)
                                            </span>
                                            <span className="text-[11px] opacity-70 font-semibold">{isDark ? 'On' : 'Off'}</span>
                                        </button>
                                    </li>

                                    <li>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2.5 text-xs font-medium text-fb-primary py-2.5 rounded-xl hover:bg-fb-secondary"
                                        >
                                            <i className="fa-solid fa-gear"></i>
                                            Settings & Privacy
                                        </Link>
                                    </li>

                                    <div className="border-t border-fb my-1"></div>

                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 text-xs font-medium text-red-500 hover:bg-red-500/10 py-2.5 rounded-xl"
                                        >
                                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            Log Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="btn btn-sm btn-ghost text-fb-primary text-xs">
                                Log In
                            </Link>
                            <Link to="/register" className="btn btn-sm bg-fb-blue hover:bg-blue-600 text-white border-none text-xs">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
