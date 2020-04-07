import {
  cleanEnv, port, str,
} from 'envalid';
import Payment from 'payments/paymentInteface';
import {CreatePaymentDto, PaymentEntity } from '../payments/paymentDto';
import InvalidPaymentTypeException from '../exceptions/invalidPaymenTypeException';

export function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
  });
}

export function calculatFee(paymentDto: CreatePaymentDto) : PaymentEntity {
  let entry = new PaymentEntity(paymentDto);
  let submissionFee : number = 0;
  switch(paymentDto.PaymentType){
    case "Bronze":
      submissionFee = paymentDto.Amount * 3 / 100;
      entry.SubmissionFee =  submissionFee;
      entry.AmountAfterCharge =  paymentDto.Amount - submissionFee; 
      return entry;
    case "Silver":
      submissionFee = paymentDto.Amount * 2 / 100;
        entry.SubmissionFee = submissionFee;
        entry.AmountAfterCharge =  paymentDto.Amount - submissionFee;
        return entry;
    case "Gold":
      submissionFee = paymentDto.Amount * 1 / 100;
      entry.SubmissionFee =  submissionFee > 50 ? 50: submissionFee;
      entry.AmountAfterCharge =  paymentDto.Amount - submissionFee;
      return entry;
    default:
      throw new InvalidPaymentTypeException()
  }
}