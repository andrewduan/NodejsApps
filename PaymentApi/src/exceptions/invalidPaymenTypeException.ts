import HttpException from './HttpException';

class InvalidPaymentTypeException extends HttpException {
  constructor() {
    super(422, 'Invalid payment type');
  }
}

export default InvalidPaymentTypeException;