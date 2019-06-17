import { Schema, Model, model } from "mongoose";
import { IPaymentLog } from "../interfaces/payment-log.interface.log";
import Messages from '../../preferences/Messages';
const PersianDate = require('persian-date');

export const PaymentLogSchema = new Schema({

    userId: {
        type: Object,
        required: [true , Messages.userMessages.userIsNotAuthenticated]
    },
    plan: {
        type: {name: String, price: Number , dateRange: Number, isActive: Boolean },
        required: [true , Messages.paymentMessages.planIsNotDefined]
    },
    isSuccess:{
        type: Boolean,
        default: undefined,
        required: false
    },
    authority: {
        type: String,
        required: [true, Messages.paymentMessages.authorityIsNotDefined]
    },
    description: {
        type: String
    },
    date: {
        type: Object,
        default: new PersianDate() 
    }
});

export const PaymentLog: Model<IPaymentLog> = model('PaymentLog', PaymentLogSchema);