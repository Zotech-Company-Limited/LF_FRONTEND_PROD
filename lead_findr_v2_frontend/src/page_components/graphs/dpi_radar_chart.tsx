"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface DpiRadarChartProps {
    website: number;
    social: number;
    backlink: number;
    brand: number;
}

export default function DpiRadarChart({ website, social, backlink, brand }: DpiRadarChartProps) {
    const toPercent = (value: number) => Math.min((value / 25) * 100, 100);

    const chartData = [
        { category: "Website", score: toPercent(website) },
        { category: "Social", score: toPercent(social) },
        { category: "Backlink", score: toPercent(backlink) },
        { category: "Brand", score: toPercent(brand) },
    ];

    return (
        <div className="rounded-xl shadow-md bg-white p-4 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} outerRadius={90}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="category"
                        stroke="#4B5563"
                        fontSize={12}
                        tick={({ payload, x, y, textAnchor }) => (
                            <text
                                x={x}
                                y={y}
                                dy={y < 150 ? -5 : 10}
                                dx={x < 150 ? -10 : 0}
                                textAnchor={textAnchor}
                                className="fill-gray-700 text-xs p-4"
                            >
                                {payload.value}
                            </text>
                        )}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            borderColor: "#e5e7eb",
                            fontSize: "0.75rem",
                        }}
                        formatter={(value: number) => `${value.toFixed(0)}%`}
                    />
                    <Radar
                        name="Scores"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeLinecap="round"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}