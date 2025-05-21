"use client";

import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ScanPoint {
    scanId: string;
    city: string;
    timestamp: string; // ISO date string
    businessCount: number;
    avgDpi: number;
}

interface ScanScatterPlotProps {
    data: ScanPoint[];
}

export default function ScanScatterPlot({ data }: ScanScatterPlotProps) {
    const processed = data.map((item) => {
        const date = new Date(item.timestamp);
        return {
            ...item,
            x: date.getTime(),
            y: date.getHours() + date.getMinutes() / 60,
        };
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📍 Scan Activity Timeline</h2>
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={['auto', 'auto']}
                        name="Date"
                        tickFormatter={(ts) =>
                            new Date(ts).toLocaleDateString("default", {
                                month: "short",
                                day: "numeric",
                            })
                        }
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        dataKey="y"
                        name="Hour of Day"
                        domain={[0, 24]}
                        tickFormatter={(tick) => `${Math.floor(tick)}:00`}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(_, __, props) => {
                            const { payload } = props;
                            return [
                                `${payload.businessCount} businesses`,
                                `City: ${payload.city} | DPI: ${payload.avgDpi}%`,
                            ];
                        }}
                        labelFormatter={(label) => {
                            const d = new Date(label);
                            return d.toLocaleString();
                        }}
                    />
                    <Scatter
                        name="Scans"
                        data={processed}
                        fill="#3b82f6"
                        line={{ strokeWidth: 1 }}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
