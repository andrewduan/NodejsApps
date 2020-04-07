import { Request, Response, NextFunction, Router } from 'express';
import PaymentNotFoundException from '../exceptions/paymentNotFoundException';
import Controller from '../interfaces/controllerInterface';
import RequestWithUser from '../interfaces/requestWithUserInterface';
import authMiddleware from '../middlewares/authMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';
import { CreatePaymentDto, PaymentEntity } from './paymentDto';
import Payment from './paymentInteface';
import paymentModel from './paymentModel';
import { calculatFee } from '../utils/validateEnv'

class PaymentController implements Controller {
  public path = '/payments';
  public router = Router();
  private payment = paymentModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllPayments);
    //this.router.get(`${this.path}/:id`, authMiddleware, this.getPaymentById);
    this.router
      //.all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePaymentDto, true), this.modifyPayment)
      .delete(`${this.path}/:id`, this.deletePayment)
      .post(this.path, authMiddleware, validationMiddleware(CreatePaymentDto), this.createPayment);
  }

  private getAllPayments = async (request: Request, response: Response) => {
    const payments = await this.payment.find()
      .populate('author', '-password');
    response.send(payments);
  }

  private getPaymentById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const payment = await this.payment.findById(id);
    if (payment) {
      response.send(payment);
    } else {
      next(new PaymentNotFoundException(id));
    }
  }

  private modifyPayment = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const paymentData: Payment = request.body;
    const payment = await this.payment.findByIdAndUpdate(id, paymentData, { new: true });
    if (payment) {
      response.send(payment);
    } else {
      next(new PaymentNotFoundException(id));
    }
  }

  private createPayment = async (request: RequestWithUser, response: Response) => {
    
    const paymentData: CreatePaymentDto = request.body;
    console.log('paymentData', paymentData);
    const createdPayment = new this.payment({
      ...calculatFee(paymentData),
      author: request.user._id,
    });
    const savedPayment = await createdPayment.save();
    await savedPayment.populate('author', '-password').execPopulate();
    response.send(savedPayment);
  }

  private deletePayment = async (request: Request, response: Response, next: NextFunction) => {
    console.log('request', request);
    const id = request.params.id;
    const successResponse = await this.payment.findByIdAndDelete(id);
    if (successResponse) {
      const payments = await this.payment.find()
      .populate('author', '-password');
      response.send(payments);
    } else {
      next(new PaymentNotFoundException(id));
    }
  }
}

export default PaymentController;