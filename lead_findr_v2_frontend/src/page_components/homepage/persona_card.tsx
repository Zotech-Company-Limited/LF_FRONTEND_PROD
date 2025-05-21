// components/homepage/persona_card.tsx
"use client";
import React from "react";
import classNames from "classnames";

type Persona = {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    summary: string;
    title: string
};

type PersonaCardProps = {
    persona: Persona;
    isActive: boolean;
    onHover?: React.MouseEventHandler<HTMLDivElement>;
    onLeave?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export default function PersonaCard({
    persona,
    isActive,
    onHover,
    onLeave,
    onClick,
}: PersonaCardProps) {
    const Icon = persona.icon;

    return (
        <div
            className={classNames(
                "group cursor-pointer relative w-full bg-white rounded-2xl p-6 border transition-all duration-300 ease-in-out transform",
                {
                    "border-gray-200 hover:shadow-xl hover:-translate-y-1": !isActive,
                    "border-blue-600 ring-2 ring-blue-100 shadow-xl": isActive,
                }
            )}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
        >
            <div className="flex flex-col items-center text-center space-y-2">
                <Icon size={28} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    {persona.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {persona.summary}
                </p>
            </div>
        </div>
    );
}