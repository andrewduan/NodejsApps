import HttpException from './HttpException';
class MissingTokenException extends HttpException {
    constructor() {
        super(401, 'Authentication token missing');
    }
}
export default MissingTokenException;
//# sourceMappingURL=missingTokenException.js.map