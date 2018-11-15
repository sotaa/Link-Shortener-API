import { IToken } from "./token.interface";
import { Document } from 'mongoose';

export interface IUser extends Document {
    generateAuthToken(): any;
    email: string;
    mobile: string;
    tokens: IToken[]
}

