'use client';

import React, { useState } from 'react';

export interface HelperCardProps {
    /** Judul tips variables */
    title: string;
    /** List tips */
    tips: string[];
}

/**
 * HelperCard Component
 * 
 * Card dismissible yang menampilkan tips penggunaan.
 * Desain "Dismissible Helper Card" menggantikan alert box standar.
 */
export function HelperCard({ title, tips }: HelperCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-6 relative z-10">
                <div className="hidden md:flex flex-shrink-0 w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm text-3xl">
                    💡
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-blue-900">
                            {title}
                        </h3>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-blue-400 hover:text-blue-600 p-1 hover:bg-blue-100 rounded-full transition-colors"
                            aria-label="Tutup tips"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {tips.map((tip, index) => (
                            <li key={index} className="flex items-start text-blue-800/80 text-sm md:text-base">
                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl" />
        </div>
    );
}
