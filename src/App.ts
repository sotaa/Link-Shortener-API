import { Express as IExpress , Request , Response } from "express";
import * as bodyParser from "body-parser";
const cors = require("cors");
import AppRoutes from "./routes";
import Database from "./dal/database.config";
import systemConsoleColors from "./config/colors/system-console.colors";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';


const express = require('express');


class App {
  private app: IExpress;

  constructor() {
    this.app = express();
    this.init();
  }

  private init() {
 
    // initial needed middlewares.
    // this.app.use(bodyParser.json());
    this.app.use(cors({preflightContinue:true})); // allow cross origin requests.
    
    // rate limit for preventing DDOS attacks.
    const limit = rateLimit({
      max: 1000,
      windowMs: 60 * 60 * 1000, // One hour
      message: 'Too many requests'
    });
    this.app.use(limit);
    
    // use helmet for increase the security.
    this.app.use(helmet({permittedCrossDomainPolicies: true}))



    // initial public folder to be available on the web.
    this.app.use(express.static('public'));

    // use custom middlewares.
     this.configAllowedHeaders();
    
    // initial application routes.
    AppRoutes.init(this.app);
    // initial database.
    Database.init();
  }

  // start the server using this method.
  listen(port: number | string) {
    this.app.listen(port , () => {
      console.log(systemConsoleColors.success , `link shortener web app is started on port ${port}`)
    });
  }

  configAllowedHeaders() {
    this.app.use((req: Request , res: Response , next) => {
      res.setHeader('Access-Control-Expose-Headers', 'x-new-token')
      next();
    });
  }
  
}

export default App;
