import { IToken } from "./token.interface";
import { Document } from "mongoose";
import { Timestamp } from "bson";

export interface IUser extends Document {
   isValid(): boolean;
   generateAuthToken(): Promise<string>;
   findByCredentials(): Promise<IUser>;
   getRemainingDays(): Promise<number>;
   isExpired(): Promise<boolean>;
   name: string;
   email: string;
   password: string;
   mobile: string;
   tokens: IToken[];
   expireDate?: Timestamp;
   remainingDays?: number;
   registerDate: Timestamp;
}
