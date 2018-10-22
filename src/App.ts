import express, { Express as IExpress } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import AppRoutes from "./routes";
import Database from "./dal/database.config";

class App {
  private app: IExpress;

  constructor() {
    this.app = express();
    this.init();
  }

  private init() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(express.static('public'));
    AppRoutes.init(this.app);
    Database.init();
  }


  listen(port: number | string) {
    this.app.listen(port);
  }
}

export default App;
