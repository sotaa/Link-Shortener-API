import path  from 'path';
import { AppPaths } from './app.paths';
import LinkRoutes from './link';
import ShortenRoutes from './shorten';
import { Request } from 'express';
import { Response } from 'express-serve-static-core';

class AppRoutes {

 init(app: any) {
   app.use(AppPaths.link , LinkRoutes);
   app.use(AppPaths.shorten , ShortenRoutes);
   app.get('/*' , (req: Request, res: Response) => {
     res.sendFile(path.resolve('public/index.html'));
   })
  }
}

export default  new AppRoutes() ;