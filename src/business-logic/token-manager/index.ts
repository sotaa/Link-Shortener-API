import  { resolve } from 'path';
import {sign} from "jsonwebtoken";
import { readFileSync } from "fs";
import expressJWT = require("express-jwt");

class TokenManager {
  private secretKey: string;

  constructor() {
    // read secret key from config.
    this.secretKey = readFileSync(resolve("src/config/settings/jwt-secret.key")).toString();
  }

  // generate the token.
  generate(data: any) {
    return sign(data, this.secretKey, {
      expiresIn: (Math.floor(Date.now() / 1000) * 60 * 60)
    });
  }

  // make verify middleware.
  getVerifyMiddleware() {
    return expressJWT({
      secret: this.secretKey,
      credentialsRequired: false
    });
  }
}

export default new TokenManager();
