import React from 'react';
import { LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden pointer-events-auto"
                        >
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                    <LogOut size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Out?</h3>
                                <p className="text-slate-500 mb-6">
                                    Are you sure you want to sign out of your account? You'll need to sign in again to access your dashboard.
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className="px-4 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;
