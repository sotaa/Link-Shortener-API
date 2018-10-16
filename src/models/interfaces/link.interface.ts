import { AnalyticsData } from "./analytics-data.interface";
import { Document } from "mongoose";

export interface ILink extends Document {
  _id: string;
  // userId?: string, this attribute will be added in next branch.
  // categoryId?: string, this attribute will be added in next branch.
  address: string;
  shorten: string;
  createDate: Date;
  data: AnalyticsData[];
  createDateFa: any;
}
