import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/httpException';

function exceptionMiddleware(
  error: HttpException,
  request: Request, // eslint-disable-line @typescript-eslint/no-unused-vars
  response: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response.status(status).send({
    message,
    status,
  });
}

export default exceptionMiddleware;
