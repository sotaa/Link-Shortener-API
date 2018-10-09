import { Response, Request } from "express";

export default class LinksController {
  create(req: Request, res: Response) {
      res.send("it's create api");
  }
}
