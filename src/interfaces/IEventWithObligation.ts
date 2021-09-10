import { Obligation } from '../classes/Obligation';
import { SumOfMoney } from '../classes/SumOfMoney';
import { IBroker } from './IBroker';

/**
 * Событие с участием облигации, для списка событий
 */
export interface IEventWithObligation {
	/**
	 * Брокер
	 */
	broker: IBroker;
	/**
	 * Дата события
	 */
	date: Date;
	/**
	 * Какая облигация участвует в событии
	 */
	obligation: Obligation;
	/**
	 * Прибыль от события
	 */
	profit: SumOfMoney;
	/**
	 * Количество облигаций
	 */
	quantity: number;
	/**
	 * Тип события
	 */
	type: 'Выплата купона' | 'Оферта' | 'Погашение' | 'Частичное погашение';
}
