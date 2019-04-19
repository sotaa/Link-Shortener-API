import { PaymentPaths } from './payment.paths';
import * as express from 'express';
import { PaymentController } from './controllers/payment.controller';


class PaymentRoutes {

    router: express.Router;
    controller: PaymentController;

    constructor() {
        this.router = express.Router();
        this.controller = new PaymentController();
        this.init();
    }

    init() {
        // initial checkout route.
        this.router.route(PaymentPaths.checkout).post(this.controller.checkout);
        // initial verify route.
        this.router.route(PaymentPaths.verify).get(this.controller.verify);
    }
}

// export router.
export default new PaymentRoutes().router;