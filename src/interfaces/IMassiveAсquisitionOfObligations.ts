import { IAсquisitionOfObligation } from './IAсquisitionOfObligation';
import { IBroker } from './IBroker';

/**
 * Данные о нескольких покупках облигаций в определённый день
 */
export interface IMassiveAсquisitionOfObligations {
	/**
	 * Приобретения
	 */
	aquisitions: IAсquisitionOfObligation[];
	/**
	 * Брокер
	 */
	broker: IBroker;
	/**
	 * Дата
	 */
	date: Date;
}
