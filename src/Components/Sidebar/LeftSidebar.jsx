import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { useTheme } from '../../Context/ThemeContext';

export default function LeftSidebar() {
    const { user, logOutContext } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    const navItems = [
        {
            icon: 'fa-solid fa-user-group text-blue-500',
            label: 'Friends & Suggestions',
            to: '/',
        },
        {
            icon: 'fa-solid fa-bookmark text-purple-500',
            label: 'Saved Posts',
            to: '/profile',
        },
        {
            icon: 'fa-solid fa-clock-rotate-left text-cyan-500',
            label: 'Memories',
            to: '/',
        },
        {
            icon: 'fa-solid fa-film text-red-500',
            label: 'Video & Media',
            to: '/',
        },
        {
            icon: 'fa-solid fa-calendar-days text-emerald-500',
            label: 'Events',
            to: '/',
        }
    ];

    return (
        <aside className="w-full h-full py-4 px-2 flex flex-col justify-between overflow-y-auto select-none">
            <div className="space-y-1">
                {/* User Profile Card */}
                {user && (
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-fb-surface transition group"
                    >
                        <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-fb shrink-0">
                            <img
                                src={user.photo || defaultAvatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = defaultAvatar; }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-fb-primary truncate group-hover:text-fb-blue transition">
                                {user.name}
                            </h4>
                            <p className="text-xs text-fb-secondary truncate">
                                @{user.username || user.email}
                            </p>
                        </div>
                    </Link>
                )}

                <div className="my-2 border-t border-fb"></div>

                {/* Primary Nav Items */}
                {navItems.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.to}
                        className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-fb-surface transition text-fb-primary font-medium text-sm group"
                    >
                        <div className="w-8 h-8 rounded-full bg-fb-secondary flex items-center justify-center shrink-0">
                            <i className={`${item.icon} text-base`}></i>
                        </div>
                        <span className="truncate group-hover:text-fb-blue transition">{item.label}</span>
                    </Link>
                ))}

                <div className="my-2 border-t border-fb"></div>

                {/* Theme Mode Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-fb-surface transition text-fb-primary font-medium text-sm cursor-pointer"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-full bg-fb-secondary flex items-center justify-center shrink-0">
                            <i className={`${isDark ? 'fa-solid fa-moon text-yellow-400' : 'fa-solid fa-sun text-amber-500'} text-base`}></i>
                        </div>
                        <span>Dark Mode</span>
                    </div>

                    <div className={`w-11 h-6 rounded-full transition p-0.5 flex items-center ${isDark ? 'bg-fb-blue justify-end' : 'bg-gray-300 justify-start'}`}>
                        <div className="w-5 h-5 rounded-full bg-white shadow-sm"></div>
                    </div>
                </button>
            </div>

            {/* Footer Links matching Facebook */}
            <div className="px-3 pt-6 text-[11px] text-fb-secondary leading-relaxed">
                <p>Privacy &middot; Terms &middot; Advertising &middot; Cookies &middot; More &middot; RoutePosts &copy; 2026</p>
            </div>
        </aside>
    );
}
