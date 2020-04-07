import { IsString, IsDateString, IsNumber } from 'class-validator';
import InvalidPaymentTypeException from '../exceptions/invalidPaymenTypeException';
 
export class CreatePaymentDto {
  
  @IsDateString()
  public PaymentDate: string;
  
  @IsNumber()
  public Amount: number; 
  
  @IsString()
  public PaymentType: string;
}

export class PaymentEntity  {

  constructor(paymentDto: CreatePaymentDto){
    this.Amount = paymentDto.Amount;
    this.PaymentDate = paymentDto.PaymentDate;
    this.PaymentTypeName = paymentDto.PaymentType;
  }

  public PaymentDate: string;
  public Amount: number;
  public SubmissionFee : number;
  public AmountAfterCharge: number;
  public PaymentTypeName: string;
}