import * as mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
    PaymentDate: Date,
    Amount: Number,
    SubmissionFee: Number,
    AmountAfterCharge: Number,
    PaymentTypeName: String
});
const paymentModel = mongoose.model('Payments', paymentSchema);
export default paymentModel;
//# sourceMappingURL=paymentModel.js.map