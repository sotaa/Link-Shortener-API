import { Link } from "./../../../models/entities/link.schema";
import { Request, Response } from "express";
import _ from "lodash";
import path from "path";
import { AnalyticsData } from "../../../models/interfaces/analytics-data.interface";
import { ILink } from "../../../models/interfaces/link.interface";
const iplocation = require("iplocation");
const PersianDate = require("persian-date");

export default class ShortenController {
  load(req: Request, res: Response) {
    const params = _.pick(req.params, ["code"]);
    Link.findOne({ shorten: params.code })
      .select({ address: 1 })
      .then(link => {
        if (link) {
          this.saveUserInfo(req, link);
          res.status(301).redirect(link.address);
        } else {
          res.sendFile(
            path.resolve(__dirname, "../../../../public/index.html")
          );
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }


  private saveUserInfo(req: Request, link: ILink) {
    iplocation('5.78.186.10', (err: any, loc: any) => {
      const userData: AnalyticsData = {
        ip: '5.78.186.10', //req.ip,
        userAgent: req.headers["user-agent"],
        location: loc || err,
        date: new Date(),
        dateFa: new PersianDate()
      };
      Link.schema.methods.addUserData(userData , link).then();
    });
  }
}
