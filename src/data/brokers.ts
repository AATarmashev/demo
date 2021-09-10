import { IBroker } from '../interfaces/IBroker';
import broker1Logo from '../assets/logo-broker1.png';
import broker2Logo from '../assets/logo-broker2.png';
/**
 * Брокеры
 */
export const Brokers = {
	/**
	 * Брокер 1
	 */
	broker1: {
		color: 'lightblue',
		logo: broker1Logo,
		name: 'Брокер 1',
		share: 0.0006, // 0.009836261,
		shareOfinterbankTransfer: 0.0,
		shortName: 'broker1',
	} as IBroker,
	/**
	 * Брокер 2
	 */
	broker2: {
		color: 'lightgreen',
		logo: broker2Logo,
		name: 'Брокер 2',
		share: 0.000472,
		shareOfinterbankTransfer: 0.01,
		shortName: 'broker2',
	} as IBroker,
};
