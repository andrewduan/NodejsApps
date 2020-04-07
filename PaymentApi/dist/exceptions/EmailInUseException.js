import HttpException from './HttpException';
class EmailInUseException extends HttpException {
    constructor(email) {
        super(400, `User with email ${email} already exists`);
    }
}
export default EmailInUseException;
//# sourceMappingURL=EmailInUseException.js.map