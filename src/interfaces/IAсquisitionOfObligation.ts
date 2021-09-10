import { Obligation } from '../classes/Obligation';

/**
 * Данные о покупке облигации
 */
export interface IAсquisitionOfObligation {
	/**
	 * Процент приобретения
	 */
	aquisitionPercent: number;
	/**
	 * Сама облигация
	 */
	obligation: Obligation;
	/**
	 * Количество
	 */
	quantity: number;
}
