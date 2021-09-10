/**
 * Брокер
 */
export interface IBroker {
	/**
	 * Цвет
	 */
	color: string;
	/**
	 * Название файла логотипа
	 */
	logo: string;
	/**
	 * Название
	 */
	name: string;
	/**
	 * Доля брокера, например 0.006
	 */
	share: number;
	/**
	 * Сколько стоит перевести деньги на счёт этого брокера, в долях
	 */
	shareOfinterbankTransfer: number;
	/**
	 * Краткое название
	 */
	shortName: string;
}
