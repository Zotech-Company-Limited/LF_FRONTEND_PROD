import axios from "@/lib/axios";

export interface UserOverviewData {
    total: number;
    active_last_30_days: number;
    new_last_7_days: number;
    by_plan: Record<string, number>;
    by_role?: Record<string, number>;
}

export interface ScanOverviewData {
    total: number;
    top_cities: { city: string; count: number }[];
    top_users: { email: string; count: number }[];
    weekly_trend: { week: string; count: number }[];
}

export interface BusinessOverviewData {
    total: number;
    low_dpi_count: number;
    top_categories: { category: string; count: number }[];
}

export interface SubscriptionOverviewData {
    total_active: number;
    revenue_this_month: number;
    canceled_this_month: number;
    upcoming_renewals: number;
    by_plan: Record<string, number>;
}

export interface AdminDashboardOverview {
    users: UserOverviewData;
    scans: ScanOverviewData;
    businesses: BusinessOverviewData;
    subscriptions: SubscriptionOverviewData;
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
    const response = await axios.get("/user/admin/overview");
    return response.data;
}

export interface BusinessSummary {
    total: number;
    new_this_week: number;
    low_dpi_count: number;
    top_categories: { category: string; count: number }[];
}


export async function getBusinessStats(): Promise<BusinessSummary> {
    const response = await axios.get("/user/admin/businesses/summary");
    return response.data;
}
export interface ScanLogEntry {
    timestamp: string;
    city: string;
    user_email: string;
    status: string;
    error?: string | null;
}

export interface ActivityFeedResponse {
    scans: ScanLogEntry[];
}

export async function getActivityFeed(): Promise<ActivityFeedResponse> {
    const response = await axios.get("/user/admin/activity");
    return response.data;
}

export interface SystemHealth {
    google_api_usage: number;
    gemini_api_usage: number;
    last_enrichment: string;
    error_count_last_24h: number;
    warnings: string[];
}

export async function getSystemHealth(): Promise<SystemHealth> {
    const response = await axios.get("/user/admin/system/health");
    return response.data;
}
