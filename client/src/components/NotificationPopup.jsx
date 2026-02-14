import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, Clock } from 'lucide-react';

const NotificationPopup = ({
    isOpen,
    onClose,
    notifications = [],
    loading = false,
    markAsRead,
    markAllAsRead
}) => {
    const navigate = useNavigate();

    const handleNotificationClick = (notif) => {
        if (!notif.read && markAsRead) {
            markAsRead(notif._id);
        }
        if (notif.link) {
            navigate(notif.link);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-12 right-0 w-80 md:w-96 z-50">
            {/* Backdrop for click-outside (transparent) */}
            <div className="fixed inset-0 z-40" onClick={onClose}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-50"
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Bell size={16} className="text-blue-600" /> Notifications
                    </h3>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 p-1.5 rounded-full shrink-0 ${notif.type === 'reply' ? 'bg-green-100 text-green-600' :
                                        notif.type === 'badge' ? 'bg-amber-100 text-amber-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {notif.type === 'reply' ? <Check size={14} /> :
                                            notif.type === 'badge' ? <Clock size={14} /> :
                                                <Bell size={14} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-semibold mb-0.5 ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-1.5">
                                            {notif.message}
                                        </p>
                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                            <Clock size={10} /> {notif.time ? notif.time : new Date(notif.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <Bell size={32} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <button onClick={onClose} className="text-xs font-medium text-slate-500 hover:text-slate-700">
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotificationPopup;
