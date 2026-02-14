import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Award } from 'lucide-react';

const AlumniHoverCard = ({ author }) => {
    if (!author) return null;

    // Only show hover card for alumni (or maybe everyone, but "View Profile" implies rich profile)
    // Assuming 'alumni' role for now based on user request context.
    const isAlumni = author.role === 'alumni';

    return (
        <div className="relative group">
            {/* The Trigger: Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer ${isAlumni ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-blue-500'
                }`}>
                {author.name ? author.name[0] : 'U'}
            </div>

            {/* The Hover Card */}
            {isAlumni && (
                <div className="absolute bottom-full left-0 mb-3 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-bottom-left">
                    {/* Arrow/Tail */}
                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white rotate-45 border-b border-r border-slate-100"></div>

                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                {author.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 leading-tight">{author.name}</h4>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                                    Alumni
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Briefcase size={14} className="text-slate-400" />
                            <span>{author.jobTitle || 'Alumni'} at <span className="font-medium text-slate-800">{author.company || 'N/A'}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{author.location || 'Location not set'}</span>
                        </div>
                    </div>

                    {/* Skills/Badges */}
                    {author.skills && author.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {author.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded border border-slate-100">
                                    {skill}
                                </span>
                            ))}
                            {author.skills.length > 3 && (
                                <span className="px-2 py-0.5 text-slate-400 text-[10px]">+ {author.skills.length - 3}</span>
                            )}
                        </div>
                    )}

                    <Link
                        to={`/student/alumni/${author._id}`}
                        className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        View Full Profile
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AlumniHoverCard;
