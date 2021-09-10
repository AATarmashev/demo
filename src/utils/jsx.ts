import { IPercent } from '../interfaces/IPercent';
import { SumOfMoney } from '../classes/SumOfMoney';

/**
 * Преобразует дату в удобочитаемый формат
 * @param date
 */
export const stringifyDate = (date: Date | null, fallback: string = ''): string => {
	if (date === null) {
		return fallback;
	}

	return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}.${date.getFullYear()}`;
};
/**
 * Для отображения денежных сумм
 * @param x
 */
export const money = (sum: SumOfMoney): string => {
	if (sum.isEmpty()) {
		return '';
	}
	const rawResult = sum.getValue();
	if (isNaN(rawResult)) {
		return '';
	}
	if (rawResult === 0) {
		return `0 ${sum.getCurrency().sign}`;
	}

	const formattedRawResult = rawResult.toFixed(2);
	const integer = Math.floor(rawResult);

	let result =
		Array.from({ length: 10 }, (x, i) => {
			const denominator = 1000 ** i;

			if (integer / denominator < 1) {
				return NaN;
			}

			return Math.floor(integer / denominator) % 1000;
		})
			.filter(x => !isNaN(x))
			.reverse()
			.map((x, i) => (i > 0 ? x.toString().padStart(3, '0') : x.toString()))
			.join(' ') + formattedRawResult.substr(formattedRawResult.length - 3, 3);

	if (result.startsWith('.')) {
		result = '0' + result;
	}

	return `${result} ${sum.getCurrency().sign}`;
};
/**
 * Для отображения денежных сумм сразу нескольких валют
 * @param summ
 */
export const sumOfMoney = (sums: SumOfMoney[]): string => {
	const notEmptySums = sums.filter(x => !x.isEmpty());
	if (notEmptySums.length < 1) {
		return '';
	}

	return notEmptySums.map(money).join(', ');
};
/**
 * Для отображения процентов
 * @param value
 */
export const percentFromNumber = (percent: number): string => {
	return percent.toFixed(2);
};
/**
 * Для отображения процентов
 * @param value
 */
export const percent = (percent: IPercent): string => {
	if (percent.isEmpty) {
		return '';
	}

	return percentFromNumber(percent.value);
};
/**
 * Для отображения процентов сразу нескольких валют
 * @param summ
 */
export const sumOfPercents = (percents: IPercent[]): string => {
	const notEmptyPercents = percents.filter(x => !x.isEmpty);
	if (notEmptyPercents.length < 1) {
		return '';
	}

	return notEmptyPercents.map(x => `${percent(x)}% (${x.currency.sign})`).join(', ');
};
