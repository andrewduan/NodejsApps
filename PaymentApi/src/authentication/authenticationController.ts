import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import EmailInUseException from '../exceptions/EmailInUseException';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import Controller from '../interfaces/controllerInterface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import validationMiddleware from '../middlewares/validationMiddleware';
import CreateUserDto from '../users/userDto';
import User from '../users/userInterface';
import userModel from './../users/userModel';
import LogInDto from './loginDto';
import TokenData from '../interfaces/tokenDataInterface'
 
class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private user = userModel;
 
  constructor() {
    this.initializeRoutes();
  }
 
  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }
 
  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;
    if (
      await this.user.findOne({ email: userData.email })
    ) {
      next(new EmailInUseException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      response.append('Set-Cookie', this.createCookie(tokenData));
      response.send(user);
    }
  }
   
  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {

    const cookies = request.cookies;
  console.log('cookies in login', cookies);
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        var cookie = this.createCookie(tokenData);
        response.append('Set-Cookie', [cookie]);   
        response.send(user);
      } else {
        next(new InvalidCredentialsException());
      }
    } else {
      next(new InvalidCredentialsException());
    }
  }
   
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token};Path=/;Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  private loggingOut = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }
}
 
export default AuthenticationController;