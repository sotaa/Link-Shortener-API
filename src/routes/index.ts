import path  from 'path';
import { AppPaths } from './app.paths';
import LinkRoutes from './link';
import ShortenRoutes from './shorten';
import AuthRoutes from './user';
import { Request , Response} from 'express';
import {Express as IExpress } from 'express';
class AppRoutes {

 init(app: IExpress) {
   // link routes.
   app.use(AppPaths.link , LinkRoutes);
   // shorten routes.
   app.use(AppPaths.shorten , ShortenRoutes);
   // auth routes.
   app.use(AppPaths.auth , AuthRoutes);

   // use front end to handle routes of unknown routes.
   app.get('/*' , (req: Request, res: Response) => {
     res.sendFile(path.resolve('public/index.html'));
   });
  }
}

export default  new AppRoutes() ;