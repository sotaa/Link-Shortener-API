import { IToken } from "./token.interface";
import { Document } from 'mongoose';

export interface IUser extends Document {
    generateAuthToken(): Promise<string>;
    findByCredentials(): Promise<IUser>;
    email: string;
    password: string;
    mobile: string;
    tokens: IToken[]
}

