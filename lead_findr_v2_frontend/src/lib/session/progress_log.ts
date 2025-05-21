// src/lib/session/progress_log.ts

import api from "@/lib/axios";

export interface ProgressLog {
    scan_id: string;
    step: number;
    status: string;
    timestamp: string;
}

/**
 * Fetches the latest progress entry for a given scan.
 */
export async function getScanProgress(scanId: string): Promise<ProgressLog> {
    const res = await api.get<ProgressLog>(`/scan/progress/${scanId}`);
    return res.data;
}
