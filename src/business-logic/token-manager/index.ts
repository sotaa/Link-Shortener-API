import  path from 'path';
import JWT from "jsonwebtoken";
import fs from "fs";
import expressJWT from "express-jwt";

class TokenManager {
  private secretKey: string;

  constructor() {
    // read secret key from config.
    this.secretKey = fs.readFileSync(path.resolve("src/config/settings/jwt-secret.key")).toString();
  }

  // generate the token.
  generate(data: any) {
    return JWT.sign(data, this.secretKey, {
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
