import { ILink } from "./../interfaces/link.interface";
import { AnalyticsData } from "./../interfaces/analytics-data.interface";
import { Schema, Model, model } from "mongoose";
import Messages from "../../preferences/Messages";
import shortenLinkGenerator from "../../business-logic/link/shorten-link-generator";
import { ObjectID } from "bson";

export const LinkSchema = new Schema({
  address: {
    type: String,
    required: Messages.linkMessages.linkIsRequired
  },
  shorten: {
    type: String,
    required: Messages.linkMessages.shortenIsRequired,
    default: shortenLinkGenerator.generate
  },
  createDate: {
    type: Date,
    required: Messages.linkMessages.createDateIsRequired,
    default: Date.now
  },
  data: {
    type: Array<AnalyticsData>(),
    default: []
  }
});

LinkSchema.methods.addUserData = (userData: AnalyticsData, link: ILink) => {
  return Link.update(
    { _id: new ObjectID(link._id) },
    { $push: { data: userData } }
  );
};


export const Link: Model<ILink> = model<ILink>("Link", LinkSchema);
