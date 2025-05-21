// app/page.tsx
"use client";

import React from "react";
import PersonaDisplaySection from "@/page_components/homepage/persona_display";
import "./globals.css"; // or your global styling import

export default function HomePage() {


    return (
        <div className="homepage flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            {/* Persona Section */}
            <PersonaDisplaySection />
        </div>
    );
}