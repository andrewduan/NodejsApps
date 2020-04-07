import HttpException from './HttpException';
class InvalidTokenException extends HttpException {
    constructor() {
        super(401, 'Wrong authentication token');
    }
}
export default InvalidTokenException;
//# sourceMappingURL=invalidTokenException.js.map