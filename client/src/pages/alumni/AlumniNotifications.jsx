import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bell, CheckCircle } from 'lucide-react';

const AlumniNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading notifications...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Notifications</h2>

            {notifications.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                    <Bell className="mx-auto mb-4 text-slate-300" size={48} />
                    <p className="text-lg font-medium">No new notifications</p>
                    <p className="text-sm">We'll let you know when something important happens.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-5 rounded-2xl border transition-all ${notification.read
                                    ? 'bg-white border-slate-100'
                                    : 'bg-blue-50 border-blue-100 shadow-sm'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm mb-1 ${notification.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-slate-400">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <CheckCircle size={14} /> Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlumniNotifications;
