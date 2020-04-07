import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/missingTokenException';
import WrongAuthenticationTokenException from '../exceptions/invalidTokenException';
import userModel from '../users/userModel';
async function authMiddleware(request, response, next) {
    const cookies = request.cookies;
    console.log('cookies', cookies);
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret);
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            if (user) {
                request.user = user;
                next();
            }
            else {
                next(new WrongAuthenticationTokenException());
            }
        }
        catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    }
    else {
        next(new AuthenticationTokenMissingException());
    }
}
export default authMiddleware;
//# sourceMappingURL=authMiddleware.js.map