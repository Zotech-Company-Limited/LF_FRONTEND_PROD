// lib/scoreMeta/dpiTiers.ts

export type DpiTier = "Elite" | "Web Leader" | "Growing Presence" | "Basic Footprint" | "Invisible"

export interface DpiTierInfo {
    name: DpiTier
    min: number
    max: number
    emoji: string
    color: string
    bgColor: string
    summary: string
    description: string
}

export const DPI_TIERS: DpiTierInfo[] = [
    {
        name: "Elite",
        min: 95,
        max: 100,
        emoji: "👑",
        color: "text-purple-700",
        bgColor: "bg-purple-100",
        summary: "Top 1% Digital Presence",
        description: "This business is elite in digital visibility — dominating across website, social, backlinks, and brand signals."
    },
    {
        name: "Web Leader",
        min: 80,
        max: 94,
        emoji: "🔥",
        color: "text-green-600",
        bgColor: "bg-green-100",
        summary: "Excellent Online Presence",
        description: "A well-established digital presence with strong signals across key areas. Just a few refinements away from elite status."
    },
    {
        name: "Growing Presence",
        min: 60,
        max: 79,
        emoji: "🚀",
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        summary: "Promising Growth",
        description: "This business is showing signs of growth online. With effort in one or two areas, they could reach the next level."
    },
    {
        name: "Basic Footprint",
        min: 30,
        max: 59,
        emoji: "👣",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        summary: "Limited Online Presence",
        description: "This business exists online but isn't reaching its potential. Strategic improvements could make a big difference."
    },
    {
        name: "Invisible",
        min: 0,
        max: 29,
        emoji: "🦕",
        color: "text-red-600",
        bgColor: "bg-red-100",
        summary: "Hard to Find Online",
        description: "There is little to no digital footprint for this business. Major opportunities for visibility are being missed."
    }
]

export function getDpiTier(score: number): DpiTierInfo {
    return DPI_TIERS.find(t => score >= t.min && score <= t.max) ?? DPI_TIERS[DPI_TIERS.length - 1]
}
