import { SumOfMoney } from '../classes/SumOfMoney';
/**
 * Платёж в определённую дату
 */
export interface IPayment {
	date: Date;
	value: SumOfMoney;
}
