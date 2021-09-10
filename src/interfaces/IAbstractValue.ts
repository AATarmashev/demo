import { ICurrency } from '../data/currencies';
/**
 * Хранилище для значения
 */
export interface IAbstractValue {
	/**
	 * Валюта
	 */
	currency: ICurrency;
	/**
	 * Нужно ли отображать и использовать в вычислениях
	 */
	isEmpty?: true;
	/**
	 * Процент
	 */
	value: number;
}
