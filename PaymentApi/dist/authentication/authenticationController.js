import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import EmailInUseException from '../exceptions/EmailInUseException';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import validationMiddleware from '../middlewares/validationMiddleware';
import CreateUserDto from '../users/userDto';
import userModel from './../users/userModel';
import LogInDto from './loginDto';
class AuthenticationController {
    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.user = userModel;
        this.registration = async (request, response, next) => {
            const userData = request.body;
            if (await this.user.findOne({ email: userData.email })) {
                next(new EmailInUseException(userData.email));
            }
            else {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = await this.user.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                user.password = undefined;
                const tokenData = this.createToken(user);
                response.append('Set-Cookie', this.createCookie(tokenData));
                response.send(user);
            }
        };
        this.loggingIn = async (request, response, next) => {
            const cookies = request.cookies;
            console.log('cookies in login', cookies);
            const logInData = request.body;
            const user = await this.user.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const tokenData = this.createToken(user);
                    var cookie = this.createCookie(tokenData);
                    response.append('Set-Cookie', [cookie]);
                    response.send(user);
                }
                else {
                    next(new InvalidCredentialsException());
                }
            }
            else {
                next(new InvalidCredentialsException());
            }
        };
        this.loggingOut = (request, response) => {
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.send(200);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token};Path=/;Max-Age=${tokenData.expiresIn}`;
    }
    createToken(user) {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        };
    }
}
export default AuthenticationController;
//# sourceMappingURL=authenticationController.js.map