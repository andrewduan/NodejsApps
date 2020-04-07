import HttpException from './HttpException';
class InvalidCredentialsException extends HttpException {
    constructor() {
        super(401, 'Invalid credentials provided');
    }
}
export default InvalidCredentialsException;
//# sourceMappingURL=InvalidCredentialsException.js.map