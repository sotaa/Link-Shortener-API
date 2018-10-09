import { AppPaths } from './app.paths';
import LinkRoutes from './link';


class AppRoutes {


 init(app: any) {
   app.use(AppPaths.link , LinkRoutes)
  }
}

export default  new AppRoutes() ;