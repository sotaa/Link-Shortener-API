import { ILink } from "./../interfaces/link.interface";
import { AnalyticsData } from "./../interfaces/analytics-data.interface";
import { Schema, Model, model } from "mongoose";
import Messages from "../../preferences/Messages";
import shortenLinkGenerator from "../../business-logic/link/shorten-link-generator";
import { ObjectID } from "bson";
import { isURL } from "validator";
const PersianDate = require('persian-date');

export const LinkSchema = new Schema({
  address: {
    type: String,
    validate: [
      isURL,
      Messages.linkMessages.linkIsNotCorrect
    ],
    required: [true , Messages.linkMessages.linkIsRequired]
  },
  userId: {
    type: String,
    required: false
  },
  shorten: {
    type: String,
    unique: true,
    required: Messages.linkMessages.shortenIsRequired,
    default: shortenLinkGenerator.generate
  },
  createDate: {
    type: Date,
    required: Messages.linkMessages.createDateIsRequired,
    default: Date.now
  },
  createDateFa: {
    type: Object,
    required: Messages.linkMessages.createDateIsRequired,
    default: new PersianDate()
  },
  data: {
    type: Array<AnalyticsData>(),
    default: []
  }
});

// add user data to a link data.
LinkSchema.methods.addUserData = (userData: AnalyticsData, link: ILink) => {
  return Link.updateOne(
    { _id: new ObjectID(link._id) },
    { $push: { data: userData } }
  );
};


export const Link: Model<ILink> = model<ILink>("Link", LinkSchema);
