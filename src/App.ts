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
    // initial needed middlewares.
    this.app.use(bodyParser.json());
    this.app.use(cors()); // allow cross origin requests.
    
    // initial public folder to be available on the web.
    this.app.use(express.static('public'));

    // initial application routes.
    AppRoutes.init(this.app);
    // initial database.
    Database.init();
  }

  // start the server using this method.
  listen(port: number | string) {
    this.app.listen(port , () => {
      console.log(`link shortener web app is started on port ${port}`)
    });
  }
}

export default App;
