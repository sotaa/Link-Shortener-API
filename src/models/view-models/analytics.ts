import { ChartData } from "../interfaces/chart-data.interface";

export interface FreeAnalyticsViewModel {
    totalClicks: number;
    referrers: ChartData[];
    browsers: ChartData[];
    platforms: ChartData[];
    locations: ChartData[];
}