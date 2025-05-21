import { Code2, Users, BarChart3 } from "lucide-react";

export const personas = {
    freelancer: {
        id: "freelancer",
        title: "Freelancers",
        benefitTitle: "Find Clients Who Need a Website",
        summary: "Spot low-visibility businesses and pitch your services with confidence.",
        insights: [
            "Discover businesses with weak digital presence",
            "Pitch design or SEO upgrades backed by data",
            "Impress with real-time online presence audits"
        ],
        quote: "LeadFindr made prospecting feel like matchmaking — I knew exactly who needed help!",
        icon: Code2,
    },
    agency: {
        id: "agency",
        title: "Agencies",
        benefitTitle: "Land Better Leads, Faster",
        summary: "Use real visibility data to attract high-value clients.",
        insights: [
            "Filter businesses by DPI score, location, and keywords",
            "Run instant audits for client pitches",
            "Build trust with proof of digital gaps"
        ],
        quote: "We closed 3 new contracts using just one scan — unreal conversion boost.",
        icon: Users,
    },
    researcher: {
        id: "researcher",
        title: "Researchers",
        benefitTitle: "Analyze Local Trends with Precision",
        summary: "Track digital presence across cities and industries with ease.",
        insights: [
            "Rank cities by digital diversity",
            "Explore underserved business types",
            "Download datasets for further analysis"
        ],
        quote: "This is the most intuitive visibility research tool I’ve seen.",
        icon: BarChart3,
    }
};
