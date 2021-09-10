/**
 * Облигация
 */
export interface IObligation {
	/**
	 * Валюта, в которой выплачиваются купоны
	 */
	currency: 'Рубль' | 'Евро' | 'Доллар США';
	date: {
		/**
		 * Даты погашения. Для амортизированных облигаций.
		 */
		maturities?: {
			date: string;
			value: number;
		}[];
		/**
		 * Дата последнего погашения
		 */
		maturity: string;
		/**
		 * Оферта
		 */
		offer: string | null;
		/**
		 * Любая дата оплаты
		 */
		payment: string;
	};
	/**
	 * Периодичность выплат в год
	 */
	periodBetweenPayments: number;
	name: {
		ISIN: string;
		inQUIK: string;
		inReport: string;
	};
	/**
	 * Первоначальная номинальная стоимость
	 */
	nominal: number;
	/**
	 * Годовой процент
	 */
	percent: number;
	/**
	 * Годовой процент после оферты
	 */
	percentAfterOffer?: number;
}
