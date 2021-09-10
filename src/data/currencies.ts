/**
 * Валюта
 */
export interface ICurrency {
	name: string;
	sign: string;
}
/**
 * Список валют
 */
export const Currencies = {
	euro: {
		name: 'Евро',
		sign: String.fromCharCode(8364),
	},
	ruble: {
		name: 'Рубль',
		sign: String.fromCharCode(8381),
	},
	usd: {
		name: 'Доллар США',
		sign: '$',
	},
};
