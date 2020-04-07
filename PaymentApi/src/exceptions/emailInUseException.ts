import HttpException from './HttpException';

class EmailInUseException extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`);
  }
}

export default EmailInUseException;