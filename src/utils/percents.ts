import { ICurrency } from '../data/currencies';
import { IPercent } from '../interfaces/IPercent';
import { Obligation } from '../classes/Obligation';
/**
 * Создаёт пустой процент
 * @param currency
 */
export const createEmptyPercentFromCurrency = (currency: ICurrency): IPercent => {
	return {
		currency,
		isEmpty: true,
		value: 0,
	};
};
/**
 * Создаёт пустой процент
 * @param obligation
 */
export const createEmptyPercent = (obligation: Obligation): IPercent => {
	return createEmptyPercentFromCurrency(obligation.getCurrency());
};
