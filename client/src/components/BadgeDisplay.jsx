import React from 'react';
import { Sprout, Zap, Award, Crown } from 'lucide-react';

const BadgeDisplay = ({ badge, size = 'md', variant = 'pill' }) => {
    if (!badge) return null;

    // 1. Badge Configuration (Icons & Colors)
    const configs = {
        'Rookie': {
            icon: Sprout,
            style: 'bg-slate-100 text-slate-600 border-slate-200',
            iconColor: 'text-slate-500',
            label: 'Rookie'
        },
        'Rising Star': {
            icon: Zap,
            style: 'bg-blue-50 text-blue-600 border-blue-200',
            iconColor: 'text-blue-500',
            label: 'Rising Star'
        },
        'Mentor': {
            icon: Award,
            style: 'bg-amber-50 text-amber-700 border-amber-200',
            iconColor: 'text-amber-600',
            label: 'Mentor'
        },
        'Legend': {
            icon: Crown,
            style: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md shadow-purple-200',
            iconColor: 'text-purple-100',
            label: 'Legend'
        }
    };

    const config = configs[badge] || configs['Rookie'];
    const Icon = config.icon;

    // 2. Size Logic
    const sizes = {
        xs: { container: 'px-1.5 py-0.5 text-[10px]', icon: 10 },
        sm: { container: 'px-2.5 py-1 text-xs', icon: 14 },
        md: { container: 'px-3 py-1.5 text-sm', icon: 16 },
        lg: { container: 'p-4', icon: 32 } // Special for card variant
    };
    const currentSize = sizes[size] || sizes.md;

    // 3. Variant: Pill (Default)
    if (variant === 'pill') {
        const isLegend = badge === 'Legend';
        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${config.style} ${currentSize.container}`}>
                <Icon size={currentSize.icon} className={isLegend ? 'text-white' : config.iconColor} />
                {config.label}
            </span>
        );
    }

    // 4. Variant: Card (Profile Impact)
    if (variant === 'card') {
        const isLegend = badge === 'Legend';
        return (
            <div className={`rounded-xl border flex flex-col items-center justify-center p-4 transition-all hover:scale-105 ${config.style}`}>
                <div className={`mb-2 p-3 rounded-full ${isLegend ? 'bg-white/20' : 'bg-white'}`}>
                    <Icon size={32} className={isLegend ? 'text-white' : config.iconColor} />
                </div>
                <div className={`text-xl font-bold ${isLegend ? 'text-white' : ''}`}>
                    {config.label}
                </div>
                <div className={`text-[10px] uppercase tracking-wider font-medium mt-1 ${isLegend ? 'text-purple-100' : 'text-slate-500'}`}>
                    Current Badge
                </div>
            </div>
        );
    }

    return null;
};

export default BadgeDisplay;
