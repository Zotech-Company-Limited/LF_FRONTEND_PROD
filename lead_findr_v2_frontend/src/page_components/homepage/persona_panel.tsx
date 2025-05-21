// components/homepage/persona_panel.tsx
import React from "react";

interface Persona {
    title: string;
    insights: string[];
    quote: string;
    benefitTitle: string;

}

interface PersonaPanelProps {
    persona: Persona;
}

export default function PersonaPanel({ persona }: PersonaPanelProps) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8 shadow-inner">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
                {persona?.benefitTitle}
            </h4>

            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
                {persona?.insights.map((point, idx) => (
                    <li key={idx}>{point}</li>
                ))}
            </ul>

            <p className="mt-6 italic text-base text-gray-700 border-l-4 border-blue-500 pl-4">
                “{persona?.quote}”
            </p>
        </div>
    );
}