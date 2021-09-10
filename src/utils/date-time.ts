import { IAсquisitionOfObligation } from '../interfaces/IAсquisitionOfObligation';
import { stringifyDate } from './jsx';
import { dayOffs, workingDays } from './calendar';
import {isAfter, isBefore, isEqual} from 'date-fns';
/**
 * Дней до оферты
 * @param x
 */
export const calcDaysTillOffer = (x: IAсquisitionOfObligation, dateFrom: Date): string => {
	if (x.obligation.getOfferDate() === null) {
		return '';
	}

	return differenceInDays2(x.obligation.getOfferDate()!, dateFrom).toString();
};
/**
 * Дней до погашения
 * @param x
 */
export const calcDaysTillMaturity = (x: IAсquisitionOfObligation, dateFrom: Date): string => {
	return differenceInDays2(x.obligation.getFinalMaturityDate(), dateFrom).toString();
};
/**
 * Переносит дату, попавшую на выходные, на следующий рабочий день
 * @param date
 */
export const transferDayOff = (date: Date): Date => {
	const dateAsString = stringifyDate(date);

	if (workingDays.includes(dateAsString)) {
		return date;
	}
	if (dayOffs.includes(dateAsString) || date.getDay() === 0 || date.getDay() === 6) {
		const transferedDate = addDays2(date, 1);

		return transferDayOff(transferedDate);
	}

	return date;
};
/**
 * Следующая дата выплаты купона
 * @param x
 */
export const calcNextCouponDate = (preiodBetweenPayments: number, paymentDate: Date, date: Date): Date => {
	const deltaInDays = differenceInDays2(paymentDate, date);
	const deltaInFullPeriods = Math.floor(deltaInDays / preiodBetweenPayments);
	const result = addDays2(paymentDate, -deltaInFullPeriods * preiodBetweenPayments);

	return transferDayOff(result);
};
/**
 * Предыдущая и следующая дата выплаты купона
 * @param x
 */
export const calcPreviousCouponDate = (preiodBetweenPayments: number, paymentDate: Date, date: Date): Date => {
	// FIXME: заменить расчёт на более точный
	const nextDate = calcNextCouponDate(preiodBetweenPayments, paymentDate, date);
	const result = addDays2(nextDate, -preiodBetweenPayments);

	return transferDayOff(result);
};
/**
 * Перенос дат, попавших на выходные, на следующий понедельник
 * @param dates
 */
export const transferDayOffs = (dates: Date[]): Date[] => dates.map(transferDayOff);
/**
 * Для создания дат
 * @param rawDate Дата в формате ДД.ММ.ГГГГ
 */
export const date = (rawDate: string): Date => {
	const [day, month, year] = rawDate.split('.');

	return new Date(+year, +month - 1, +day);
};

const milisecondsInDay = 24 * 60 * 60 * 1000;

/**
 * Работает польностью аналогично функции differenceInDays из date-fns, но
 * лучше оптимизирована.
 * @param x
 * @param y
 */
export const differenceInDays2 = (x: Date, y: Date): number => {
	const deltaMilis = x.getTime() - y.getTime();
	const deltaDays =
		deltaMilis > 0 ? Math.floor(deltaMilis / milisecondsInDay) : Math.ceil(deltaMilis / milisecondsInDay);

	return deltaDays === -0 ? 0 : deltaDays;
};
/**
 * Работает аналогично функции addDays из date-fns, но
 * лучше оптимизирована. Разница только в том, что, в некоторых
 * случаях, при days < 0 разница в результатах с addDays
 * составляет 1 час.
 * @param x
 * @param y
 */
export const addDays2 = (x: Date, days: number): Date => {
	return new Date(x.getTime() + days * milisecondsInDay);
};
/**
 * Находится ли date в полуинтервале (dateOfStart, dateOfEnd]
 * @param date 
 * @param detOfStart 
 * @param dateOfEnd 
 */
export const dateIsBetween = (date: Date, dateOfStart: Date, dateOfEnd: Date): boolean => {
	return isAfter(date, dateOfStart) && 
		(isBefore(date, dateOfEnd) || isEqual(date, dateOfEnd));
}