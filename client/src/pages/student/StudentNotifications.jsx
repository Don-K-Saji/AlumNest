import React, { useEffect, useState } from 'react';
import { Bell, MessageSquare, Star } from 'lucide-react';
import api from '../../services/api';

const StudentNotifications = () => {
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

    const markAllAsRead = async () => {
        // Ideally backend should support this, but for now we loop or just optimistic UI
        // Let's just refresh for now or implement bulk update later if needed.
        // For MVP, we can iterate:
        notifications.forEach(n => !n.read && markAsRead(n._id));
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading notifications...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 font-medium hover:underline"
                    >
                        Mark visible as read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Bell className="mx-auto mb-4 text-slate-300" size={48} />
                        <p>No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`p-4 border-b border-slate-100 last:border-0 flex gap-4 transition-colors ${!notif.read ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'reply' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                {notif.type === 'reply' ? <MessageSquare size={20} /> : <Star size={20} />}
                            </div>

                            <div className="flex-1">
                                <p className="text-slate-900 font-medium text-sm leading-relaxed">
                                    {notif.message}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-500">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                    {!notif.read && (
                                        <button
                                            onClick={() => markAsRead(notif._id)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!notif.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
