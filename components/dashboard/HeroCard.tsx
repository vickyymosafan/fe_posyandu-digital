'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';

export interface HeroCardProps {
    /** Judul kartu */
    title: string;
    /** Deskripsi singkat */
    description: string;
    /** Icon SVG */
    icon: React.ReactNode;
    /** Link tujuan */
    href: string;
    /** Warna tema (default: sage) */
    variant?: 'sage' | 'emerald' | 'blue' | 'purple';
}

/**
 * HeroCard Component
 * 
 * Large touchable button/card untuk aksi utama di dashboard Petugas.
 * Mengikuti Fitt's Law dengan area klik yang luas dan visual yang jelas.
 */
export function HeroCard({
    title,
    description,
    icon,
    href,
    variant = 'sage',
}: HeroCardProps) {
    const getStyles = () => {
        switch (variant) {
            case 'sage':
                return {
                    wrapper: 'bg-white hover:border-sage-300 hover:shadow-sage-100',
                    iconBg: 'bg-sage-100 text-sage-600',
                    title: 'text-neutral-900',
                };
            case 'blue':
                return {
                    wrapper: 'bg-white hover:border-blue-300 hover:shadow-blue-100',
                    iconBg: 'bg-blue-100 text-blue-600',
                    title: 'text-neutral-900',
                };
            default:
                return {
                    wrapper: 'bg-white hover:border-neutral-300 hover:shadow-neutral-100',
                    iconBg: 'bg-neutral-100 text-neutral-600',
                    title: 'text-neutral-900',
                };
        }
    };

    const styles = getStyles();

    return (
        <Link href={href} className="block h-full group">
            <Card
                className={`h-full border border-transparent transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg ${styles.wrapper}`}
            >
                <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${styles.iconBg}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold mb-2 group-hover:text-sage-600 transition-colors ${styles.title}`}>
                            {title}
                        </h3>
                        <p className="text-neutral-500 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <div className="mt-auto pt-6 flex items-center text-sm font-semibold text-neutral-400 group-hover:text-sage-600 transition-colors">
                        <span>Mulai Sekarang</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
