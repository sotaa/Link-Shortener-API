import { Schema, model , Model } from "mongoose";
import Messages from "../../preferences/Messages";
import { IPaymentPlan } from "../interfaces/payment-plan.interface";

export const PaymentPlanSchema = new Schema({
  name: {
    type: String,
    required: [true, Messages.paymentPlanMessages.planNameIsRequired]
  },
  price: {
    type: Number,
    required: [true, Messages.paymentPlanMessages.planPriceIsRequired],
    validate: {
        validator: (value: number) => value > 0,
        message: Messages.paymentPlanMessages.priceIsNotValid
    }
  },
  dateRange: {
    type: Number,
    required: [true, Messages.paymentPlanMessages.planPriceIsRequired],
    validate: {
        validator: (value: number) => value > 0,
        message: Messages.paymentPlanMessages.priceIsNotValid
    }
  },
  isActive: {
      type: Boolean,
      required: true,
      default: true
  },
  description: {
    type: String,
    required: false
  }
});


export const PaymentPlan: Model<IPaymentPlan> = model<IPaymentPlan>("PaymentPlan" , PaymentPlanSchema)