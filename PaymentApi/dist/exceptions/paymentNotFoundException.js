import HttpException from "./httpException";
class PaymentNotFoundException extends HttpException {
    constructor(id) {
        super(404, `Payment with id ${id} not found`);
    }
}
export default PaymentNotFoundException;
//# sourceMappingURL=paymentNotFoundException.js.map