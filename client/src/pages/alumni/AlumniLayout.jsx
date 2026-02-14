import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    UserCircle,
    LogOut,
    GraduationCap,
    Trophy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../../components/LogoutModal';
import NotificationPopup from '../../components/NotificationPopup';
import useNotifications from '../../hooks/useNotifications';

const AlumniLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Notifications Hook
    const {
        notifications,
        unreadCount,
        loading: notificationsLoading,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    // Fallback if user is null
    if (!user) return null;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/alumni/dashboard' },
        { icon: MessageSquare, label: 'Query Feed', path: '/alumni/feed' },
        { icon: UserCircle, label: 'My Profile', path: '/alumni/profile' },
        { icon: Trophy, label: 'Leaderboard', path: '/alumni/leaderboard' },
    ];

    const handleLogoutConfirm = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="p-1.5 bg-blue-600 rounded-lg">
                        <GraduationCap size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">AlumNest</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-900">ALUMNI</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-colors cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Welcome back, {user.name.split(' ')[0]}
                        </h1>
                        <p className="text-slate-500">
                            {user.jobTitle && user.company ? `${user.jobTitle} @ ${user.company}` : 'Alumni Member'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell Icon */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors relative"
                            >
                                <Bell size={20} />
                                {/* Red dot */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </button>
                            <NotificationPopup
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                                notifications={notifications}
                                loading={notificationsLoading}
                                markAsRead={markAsRead}
                                markAllAsRead={markAllAsRead}
                            />
                        </div>

                        <Link to="/alumni/profile" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-200 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{user.name}</span>
                        </Link>
                    </div>
                </header>

                <div className="max-w-6xl">
                    <Outlet />
                </div>
            </main>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default AlumniLayout;
