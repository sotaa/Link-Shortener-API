import { IUser } from './../interfaces/user.interface';
import { Schema, Model , model } from "mongoose";
import { isEmail } from "validator";
import Messages from "../../preferences/Messages";
import isMobilePhone = require("validator/lib/isMobilePhone");
import tokenManager from '../../business-logic/token-manager';
import { TokenType } from '../interfaces/token.interface';
import _ from 'lodash';

export const UserSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: isEmail,
      message: Messages.userDataMessages.emailIsIncorrect
    },
    trim: true,
    required: false,
    unique: true
  },
  password: {
    required: true,
    type: String,
    minlength: [6, Messages.userDataMessages.passwordMustBeAtLeast6Character]
  },
  mobile: {
    type: String,
    required: false,
    validate: {
      validator: (value: string) => {
        return isMobilePhone(value, "fa-IR");
      },
      message: Messages.userDataMessages.mobileIsIncorrect
    }
  },
  tokens: [
    {
      type: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }
  ]
});

// make json object.
UserSchema.methods.toJSON = function() {
  const user = this;
  var userObject = user.toObject();
  return _.pick(userObject , ['_id' , 'email' , 'mobile'])
}

// generate auth token.
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const token = tokenManager.generate({_id: user._id , email: user.email , mobile: user.mobile});
  user.tokens = user.tokens || []; // make empty array if there are no token.
  user.tokens.push({type: TokenType.auth , value: token});
  return user.save().then(() => token);
}

// handle duplicate email error.
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(Messages.userDataMessages.emailIsExists));
  } else {
    next(error);
  }
});

export const User: Model<IUser> = model<IUser>("User" , UserSchema)