import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authenticationController';
import PaymentController from './payments/paymentController';
//import ReportController from './report/report.controller';
//mport UserController from './users/UserController';
import { validateEnv } from './utils/validateEnv';
validateEnv();
const app = new App([
    new PaymentController(),
    new AuthenticationController(),
]);
app.listen();
//# sourceMappingURL=server.js.map