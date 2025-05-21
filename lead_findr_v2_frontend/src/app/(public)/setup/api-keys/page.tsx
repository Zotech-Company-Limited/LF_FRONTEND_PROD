// src/app/setup/api-keys/page.tsx
import React from "react";
import { API_KEY_SETUP_STEPS } from "@/page_components/guides/data/API-Keys/api_key_guide";
import StepSectionLayout from "@/page_components/guides/step_section_layout";

export default function APIKeyGuidePage() {
    return (
        <main className="max-w-5xl mx-auto px-6 py-12 mt-8">
            <h1 className="text-3xl font-bold mb-8">How to Set Up Your Google API Keys</h1>
            <p className="text-gray-600 mb-12">
                These keys are required to run scans in Lead Findr. Follow the steps below to complete setup.
            </p>
            <StepSectionLayout steps={API_KEY_SETUP_STEPS} />
        </main>
    );
}
