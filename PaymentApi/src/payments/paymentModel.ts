import * as mongoose from 'mongoose';
import Payment from './paymentInteface';
 
const paymentSchema = new mongoose.Schema({
  PaymentDate: Date,
  Amount: Number,
  SubmissionFee: Number,
  AmountAfterCharge: Number,
  PaymentTypeName: String
});
 
const paymentModel = mongoose.model<Payment & mongoose.Document>('Payments', paymentSchema);
 
export default paymentModel;