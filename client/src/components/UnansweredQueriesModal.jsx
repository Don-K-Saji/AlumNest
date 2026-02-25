import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const UnansweredQueriesModal = ({ isOpen, onClose }) => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nudging, setNudging] = useState(null); // ID of query being nudged

    useEffect(() => {
        if (isOpen) {
            fetchUnansweredQueries();
        }
    }, [isOpen]);

    const fetchUnansweredQueries = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/queries');
            // Filter locally for now
            const unanswered = data.filter(q => q.responses.length === 0);
            setQueries(unanswered);
        } catch (error) {
            console.error("Failed to fetch queries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNudge = async (queryId) => {
        try {
            setNudging(queryId);
            const { data } = await api.post(`/queries/${queryId}/nudge`);
            toast.success(data.message); // Simple feedback for now
        } catch (error) {
            console.error("Failed to nudge", error);
            toast.error("Failed to send nudge.");
        } finally {
            setNudging(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Unanswered Queries</h2>
                            <p className="text-slate-500 text-sm">Queries awaiting their first response.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loading ? (
                            <div className="text-center py-12 text-slate-400">Loading queries...</div>
                        ) : queries.length > 0 ? (
                            queries.map(query => (
                                <div key={query._id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors bg-slate-50/50">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${query.type === 'targeted' ? 'bg-purple-100 text-purple-700' :
                                                    query.type === 'category' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {query.type}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(query.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1">{query.title}</h3>
                                            <p className="text-sm text-slate-600 line-clamp-2">{query.description}</p>

                                            {query.tags && query.tags.length > 0 && (
                                                <div className="flex gap-2 mt-2">
                                                    {query.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleNudge(query._id)}
                                            disabled={nudging === query._id}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                        >
                                            {nudging === query._id ? (
                                                <span className="animate-pulse">Sending...</span>
                                            ) : (
                                                <>
                                                    <Send size={14} /> Nudge
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No unanswered queries found. Great job!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UnansweredQueriesModal;
