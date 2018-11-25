import { IToken } from "./token.interface";
import { Document } from 'mongoose';
import { Timestamp } from "bson";

export interface IUser extends Document {
    generateAuthToken(): Promise<string>;
    findByCredentials(): Promise<IUser>;
    name: string;
    email: string;
    password: string;
    mobile: string;
    tokens: IToken[],
    expireDate: Timestamp,
    registerDate: Timestamp
}

