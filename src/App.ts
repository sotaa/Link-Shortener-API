import express, { Express as IExpress } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import AppRoutes from "./routes";

class App {
  private app: IExpress;

  constructor() {
    this.app = express();
    this.configMiddleware();
  }

  private configMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    AppRoutes.init(this.app);
  }

  listen(port: number) {
    this.app.listen(port);
  }
}

export default App;
