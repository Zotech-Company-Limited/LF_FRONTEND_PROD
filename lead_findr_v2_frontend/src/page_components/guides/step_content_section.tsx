// components/guides/step_content_section.tsx
"use client";

import React from "react";

interface Props {
    id: string;
    title: string;
    children: React.ReactNode;
    stepNumber?: number;
}

export default function StepContentSection({ id, title, children, stepNumber }: Props) {
    return (
        <section id={id} className="scroll-mt-32">
            <div className="mb-4">
                {stepNumber !== undefined && (
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                        Step {stepNumber}
                    </p>
                )}
                <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
            <div className="prose max-w-none">{children}</div>
        </section>
    );
}
