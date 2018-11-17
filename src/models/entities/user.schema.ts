import { IUser } from "./../interfaces/user.interface";
import { Schema, Model, model } from "mongoose";
import { isEmail } from "validator";
import Messages from "../../preferences/Messages";
import isMobilePhone = require("validator/lib/isMobilePhone");
import tokenManager from "../../business-logic/token-manager";
import { TokenType } from "../interfaces/token.interface";
import _ from "lodash";
import { genSalt, hash, compare } from "bcryptjs";

export const UserSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: isEmail,
      message: Messages.userMessages.emailIsIncorrect
    },
    trim: true,
    required: false,
    unique: true
  },
  password: {
    required: true,
    type: String,
    minlength: [6, Messages.userMessages.passwordMustBeAtLeast6Character]
  },
  mobile: {
    type: String,
    required: false,
    validate: {
      validator: (value: string) => {
        return isMobilePhone(value, "fa-IR");
      },
      message: Messages.userMessages.mobileIsIncorrect
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
  return _.pick(userObject, ["_id", "email", "mobile"]);
};

// generate auth token.
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const token = tokenManager.generate({
    _id: user._id,
    email: user.email,
    mobile: user.mobile
  });
  user.tokens = user.tokens || []; // make empty array if there are no token.
  user.tokens.push({ type: TokenType.auth, value: token });
  return user.save().then(() => token);
};

// get by credential method.
UserSchema.statics.findByCredentials = function(credentials: any) {
  const User = this;
  return User.findOne({ email: credentials.email })
    .then(async (user: IUser) => {
      // reject the promise if the user does not found;
      if (!user) return Promise.reject(Messages.userMessages.loginFailed);

      // compare password with the hashed value.
      const passIsCorrect = await compare(credentials.password, user.password);
      // return the result if password is correct.
      if (passIsCorrect) return Promise.resolve(user);
      else return Promise.reject(Messages.userMessages.loginFailed);
    })
    .catch((err: any) => {
      return Promise.reject(err);
    });
};

// hash the new password before saving the user.
UserSchema.pre("save", async function(next) {
  const user = <IUser>this;
  if (user.isModified("password")) {
    const salt = await genSalt(10);
    const hashedPass = await hash(user.password, salt);
    user.password = hashedPass;
  }
  next();
});

// handle duplicate email error.
UserSchema.post("save", function(error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error(Messages.userMessages.emailIsExists));
  } else {
    next(error);
  }
});

export const User: Model<IUser> = model<IUser>("User", UserSchema);
