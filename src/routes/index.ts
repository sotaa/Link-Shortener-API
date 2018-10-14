import { AppPaths } from './app.paths';
import LinkRoutes from './link';
import ShortenRoutes from './shorten';

class AppRoutes {


 init(app: any) {
   app.use(AppPaths.link , LinkRoutes);
   app.use(AppPaths.shorten , ShortenRoutes);
  }
}

export default  new AppRoutes() ;