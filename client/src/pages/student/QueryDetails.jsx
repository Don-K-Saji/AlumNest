import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, MessageCircle, Send, Edit, ThumbsUp, Check, Award } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AlumniHoverCard from '../../components/AlumniHoverCard';
import EditQueryModal from '../../components/EditQueryModal';
import NotificationPopup from '../../components/NotificationPopup'; // Re-use if needed for confetti? No, keep simple first.

const QueryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [editingResponseId, setEditingResponseId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchQuery();
    }, [id]);

    const fetchQuery = async () => {
        try {
            const { data } = await api.get(`/queries/${id}`);
            setQuery(data);
        } catch (error) {
            console.error("Failed to fetch query", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async () => {
        if (!confirm('Mark this query as resolved?')) return;
        try {
            const { data } = await api.put(`/queries/${id}/status`, { status: 'Resolved' });
            setQuery(prev => ({ ...prev, status: 'Resolved' }));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const handleLike = async (responseId) => {
        try {
            const { data } = await api.post(`/gamification/responses/${responseId}/like`);
            // Update local state
            setQuery(prev => ({
                ...prev,
                responses: prev.responses.map(r =>
                    r._id === responseId ? { ...r, upvotes: data } : r
                )
            }));
        } catch (error) {
            console.error("Failed to like", error);
        }
    };

    const handleAccept = async (responseId) => {
        if (!confirm('Mark this answer as the accepted solution? This will grant points to the author and resolve the query.')) return;
        try {
            const { data } = await api.post(`/gamification/responses/${responseId}/accept`);
            // Update local state
            setQuery(prev => ({
                ...prev,
                status: 'Resolved',
                responses: prev.responses.map(r =>
                    r._id === responseId ? { ...r, isAccepted: true } : r
                )
            }));
        } catch (error) {
            console.error("Failed to accept solution", error);
            alert(error.response?.data?.message || "Failed to accept solution");
        }
    };

    const handleEditClick = (response) => {
        setEditingResponseId(response._id);
        setEditContent(response.content);
    };

    const handleSaveEdit = async (responseId) => {
        if (!editContent.trim()) return;

        try {
            const { data } = await api.put(`/queries/responses/${responseId}`, { content: editContent });

            // Update local state
            setQuery(prev => ({
                ...prev,
                responses: prev.responses.map(r =>
                    r._id === responseId ? { ...r, content: data.content } : r
                )
            }));
            setEditingResponseId(null);
            setEditContent('');
        } catch (error) {
            console.error("Failed to update response", error);
            alert("Failed to update response");
        }
    };

    const handleCancelEdit = () => {
        setEditingResponseId(null);
        setEditContent('');
    };

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await api.post(`/queries/${id}/responses`, { content: replyContent });

            // Optimistically update or re-fetch
            const newResponse = {
                ...data,
                author: { name: user.name, role: user.role, _id: user._id }, // Mock populated fields
                upvotes: []
            };

            setQuery(prev => ({
                ...prev,
                responses: [...prev.responses, newResponse]
            }));
            setReplyContent('');
        } catch (error) {
            console.error("Failed to post reply", error);
            alert("Failed to post reply.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading discussion...</div>;
    if (!query) return <div className="p-10 text-center text-slate-500">Query not found.</div>;

    const isAuthor = user && (query.author._id === user._id || query.author === user._id);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft size={18} /> Back to Queries
            </button>

            {/* Main Question Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">{query.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Posted by {query.author.name}</span>
                                <span>•</span>
                                <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${query.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {query.status === 'Resolved' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                {query.status || 'Pending'}
                            </span>

                            {isAuthor && query.status !== 'Resolved' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <EditQueryModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        query={query}
                        onQueryUpdated={(updatedQuery) => {
                            setQuery(prev => ({ ...prev, ...updatedQuery }));
                        }}
                    />

                    <div className="prose max-w-none text-slate-700 leading-relaxed mb-6">
                        {query.description}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {query.tags && query.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Responses Section */}
                <div className="bg-slate-50 p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MessageCircle size={20} />
                        {query.responses ? query.responses.length : 0} Responses
                    </h3>

                    <div className="space-y-6">
                        {query.responses && query.responses.length > 0 ? (
                            query.responses.map((resp, idx) => {
                                const isLiked = resp.upvotes && resp.upvotes.includes(user._id);
                                const likeCount = resp.upvotes ? resp.upvotes.length : 0;
                                const isResponseAuthor = user && (resp.author._id === user._id || resp.author === user._id);
                                const isEditing = editingResponseId === resp._id;

                                return (
                                    <div key={idx} className={`bg-white p-6 rounded-xl border shadow-sm transition-all ${resp.isAccepted ? 'border-green-500 ring-1 ring-green-500 bg-green-50/30' : 'border-slate-200'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <AlumniHoverCard author={resp.author} />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                        {resp.author?.name || 'Unknown'}
                                                        {resp.author?.role === 'alumni' && (
                                                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded uppercase tracking-wider">
                                                                Alumni
                                                            </span>
                                                        )}
                                                        {resp.isAccepted && (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold flex items-center gap-1">
                                                                <CheckCircle size={12} /> Accepted Answer
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(resp.createdAt || Date.now()).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Accept Button (Only for Author, if not already resolved/accepted) */}
                                                {isAuthor && !query.status?.includes('Resolved') && !resp.isAccepted && (
                                                    <button
                                                        onClick={() => handleAccept(resp._id)}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                        title="Mark as Solution"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}

                                                {/* Edit Button (Only for Response Author) */}
                                                {isResponseAuthor && !isEditing && (
                                                    <button
                                                        onClick={() => handleEditClick(resp)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Edit Response"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                )}

                                                {/* Like Button */}
                                                <button
                                                    onClick={() => handleLike(resp._id)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isLiked
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    <ThumbsUp size={14} className={isLiked ? 'fill-blue-600' : ''} />
                                                    {likeCount > 0 && <span>{likeCount}</span>}
                                                </button>
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <div className="pl-11">
                                                <textarea
                                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none mb-2"
                                                    rows="3"
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleCancelEdit()}
                                                        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveEdit(resp._id)}
                                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-slate-700 text-sm whitespace-pre-wrap pl-11">
                                                {resp.content}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-slate-400 italic">
                                No responses yet. Getting the conversation started...
                            </div>
                        )}
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleSubmitReply} className="mt-8 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                            {user.name[0]}
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <textarea
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                                    rows="3"
                                    placeholder="Add to the discussion..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={submitting || !replyContent.trim()}
                                    className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QueryDetails;
