import { Router } from 'express';
import PaymentNotFoundException from '../exceptions/paymentNotFoundException';
import authMiddleware from '../middlewares/authMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';
import { CreatePaymentDto } from './paymentDto';
import paymentModel from './paymentModel';
import { calculatFee } from '../utils/validateEnv';
class PaymentController {
    constructor() {
        this.path = '/payments';
        this.router = Router();
        this.payment = paymentModel;
        this.getAllPayments = async (request, response) => {
            const payments = await this.payment.find()
                .populate('author', '-password');
            response.send(payments);
        };
        this.getPaymentById = async (request, response, next) => {
            const id = request.params.id;
            const payment = await this.payment.findById(id);
            if (payment) {
                response.send(payment);
            }
            else {
                next(new PaymentNotFoundException(id));
            }
        };
        this.modifyPayment = async (request, response, next) => {
            const id = request.params.id;
            const paymentData = request.body;
            const payment = await this.payment.findByIdAndUpdate(id, paymentData, { new: true });
            if (payment) {
                response.send(payment);
            }
            else {
                next(new PaymentNotFoundException(id));
            }
        };
        this.createPayment = async (request, response) => {
            const paymentData = request.body;
            console.log('paymentData', paymentData);
            const createdPayment = new this.payment(Object.assign(Object.assign({}, calculatFee(paymentData)), { author: request.user._id }));
            const savedPayment = await createdPayment.save();
            await savedPayment.populate('author', '-password').execPopulate();
            response.send(savedPayment);
        };
        this.deletePayment = async (request, response, next) => {
            console.log('request', request);
            const id = request.params.id;
            const successResponse = await this.payment.findByIdAndDelete(id);
            if (successResponse) {
                response.send(200);
            }
            else {
                next(new PaymentNotFoundException(id));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllPayments);
        //this.router.get(`${this.path}/:id`, authMiddleware, this.getPaymentById);
        this.router
            //.all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePaymentDto, true), this.modifyPayment)
            .delete(`${this.path}/:id`, this.deletePayment)
            .post(this.path, authMiddleware, validationMiddleware(CreatePaymentDto), this.createPayment);
    }
}
export default PaymentController;
//# sourceMappingURL=paymentController.js.map