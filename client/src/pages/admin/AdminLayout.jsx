import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Settings, LogOut, Bell, UserCircle } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../../components/LogoutModal';
import NotificationPopup from '../../components/NotificationPopup';
import useNotifications from '../../hooks/useNotifications';

const AdminLayout = () => {
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

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: ShieldCheck, label: 'Verify Users', path: '/admin/verify-users' },
        { icon: Users, label: 'Manage Users', path: '/admin/users' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogoutConfirm = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-tight">AlumNest Admin</span>
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
                        className="flex items-center gap-3 px-4 py-3 text-red-400 w-full hover:bg-slate-800 rounded-lg"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                        <p className="text-slate-500">System Overview & Controls</p>
                    </div>

                    <div className="flex items-center gap-4">
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

                        <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                <UserCircle size={20} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{user?.name || 'Admin'}</span>
                        </div>
                    </div>
                </header>

                <Outlet />
            </main>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default AdminLayout;
