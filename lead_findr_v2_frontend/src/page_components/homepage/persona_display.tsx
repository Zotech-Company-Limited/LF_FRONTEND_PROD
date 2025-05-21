// components/homepage/PersonaDisplaySection.tsx
"use client";
import { useState } from "react";
import { personas } from "./personas";
import PersonaCard from "./persona_card";
import PersonaPanel from "./persona_panel";
import { Radar, ScanLine, LogIn } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/api/swr";

type PersonaKey = keyof typeof personas;

export default function PersonaDisplaySection() {
    const [hovered, setHovered] = useState<PersonaKey | null>(null);
    const [selected, setSelected] = useState<PersonaKey>("freelancer");
    const active: PersonaKey = hovered || selected;
    const { user, isLoading } = useUser();


    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-50">
            <Radar className="mx-auto text-blue-600 animate-pulse mb-5" size={32} />

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3">
                Built to Help You Win Online — No Matter Who You Are
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                LeadFindr shows you which businesses are thriving digitally — and how you can too.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 mb-10">
                <Link
                    href="/scan"
                    className="group inline-flex items-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <ScanLine size={20} className="transition-transform group-hover:scale-110" />
                    Run Your First Scan
                </Link>

                {!user && !isLoading && (
                    <Link
                        href="/login"
                        className="group inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        <LogIn size={18} className="transition-transform group-hover:scale-110" />
                        Login to Gain Access
                    </Link>
                )}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(personas).map((persona) => (
                    <PersonaCard
                        key={persona.id}
                        persona={persona}
                        isActive={active === persona.id}
                        onHover={() => setHovered(persona.id as PersonaKey)}
                        onLeave={() => setHovered(null)}
                        onClick={() => setSelected(persona.id as PersonaKey)}
                    />
                ))}
            </div>

            <div className="mt-10">
                <PersonaPanel persona={personas[active]} />
            </div>
        </section>
    );
}
