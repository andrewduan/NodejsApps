var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsString, IsDateString, IsNumber } from 'class-validator';
export class CreatePaymentDto {
}
__decorate([
    IsDateString()
], CreatePaymentDto.prototype, "PaymentDate", void 0);
__decorate([
    IsNumber()
], CreatePaymentDto.prototype, "Amount", void 0);
__decorate([
    IsString()
], CreatePaymentDto.prototype, "PaymentType", void 0);
export class PaymentEntity {
    constructor(paymentDto) {
        this.Amount = paymentDto.Amount;
        this.PaymentDate = paymentDto.PaymentDate;
        this.PaymentTypeName = paymentDto.PaymentType;
    }
}
//# sourceMappingURL=paymentDto.js.map