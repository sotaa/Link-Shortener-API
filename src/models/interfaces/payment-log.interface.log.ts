import { Document } from 'mongoose';
import { IPaymentPlan } from "./payment-plan.interface";

export interface IPaymentLog extends Document {
    userId: string;
    plan: IPaymentPlan;
    date?: object;
    isSuccess?: boolean;
    authority: string;
    description?: string;
}