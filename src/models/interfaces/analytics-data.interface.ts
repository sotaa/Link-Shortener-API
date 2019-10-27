import { UserAgent } from "express-useragent";

export interface AnalyticsData {
    ip: string;
    userAgent?: UserAgent;
    location: any;
    locationMinimalData: any;
    date: Date,
    dateFa: any,
    referrer?: string
}