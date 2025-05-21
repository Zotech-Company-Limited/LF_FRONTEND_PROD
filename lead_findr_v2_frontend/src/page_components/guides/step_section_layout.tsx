// components/guides/step_section_layout.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import StepContentSection from "./step_content_section";

interface StepData {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface Props {
    steps: StepData[];
}

export default function StepSectionLayout({ steps }: Props) {
    const [activeStep, setActiveStep] = useState<string>(steps[0]?.id);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        setActiveStep(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "0px 0px -60% 0px",
                threshold: 0.5,
            }
        );

        steps.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) {
                sectionRefs.current[id] = el;
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, [steps]);

    const scrollToStep = (id: string) => {
        const el = sectionRefs.current[id];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="flex flex-col lg:flex-row w-full gap-10">
            {/* Sidebar */}
            <aside
                className="
                lg:flex-[0_0_30%]   /* ⬅  occupy at most 30 % and no more */
                lg:max-w-[30%]
                min-w-[220px]       /* keeps it readable on very wide screens */
                lg:sticky lg:top-24 lg:h-fit
                border-r border-gray-200 pr-6 text-sm
                "
            >
                <ul className="space-y-4">
                    {steps.map((step, i) => (
                        <li
                            key={step.id}
                            onClick={() => scrollToStep(step.id)}
                            className={`cursor-pointer transition duration-200 ${activeStep === step.id
                                ? "text-blue-600 font-semibold"
                                : "text-gray-500"
                                }`}
                        >
                            <span className="mr-2 text-xs text-gray-400">{i + 1}.</span>
                            {step.title}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Step Content */}
            <section className="flex-1 pl-8 space-y-24">
                {steps.map((step, idx) => (
                    <StepContentSection
                        key={step.id}
                        id={step.id}
                        title={step.title}
                        stepNumber={idx + 1}
                    >
                        {step.content}
                    </StepContentSection>
                ))}
            </section>
        </div>

    );
}