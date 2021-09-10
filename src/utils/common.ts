import { IAсquisitionOfObligation } from '../interfaces/IAсquisitionOfObligation';
import { shareOfStockExcange, refinancingRate, personalIncomeTax } from '../data/constants';
import { isBefore } from 'date-fns';
import { createEmptyPercent } from './percents';
import { IPercent } from '../interfaces/IPercent';
import { Obligation } from '../classes/Obligation';
import { SumOfMoney } from '../classes/SumOfMoney';
import { differenceInDays2 } from './date-time';
import { IBroker } from '../interfaces/IBroker';
/**
 * Прибыль за облигацию
 * @param x
 */
export const calcCurrencyPerObligation = (x: IAсquisitionOfObligation, date: Date): SumOfMoney => {
	return x.obligation.getNominal(date).multiply(x.aquisitionPercent / 100.0);
};
/**
 * Цена всего
 * @param x
 */
export const calcCurrencyTotally = (x: IAсquisitionOfObligation, date: Date): SumOfMoney => {
	return calcCurrencyPerObligation(x, date).multiply(x.quantity);
};
/**
 * Добавляет комиссии покупки к сумме
 * @param sum 
 * @param broker 
 * @returns 
 */
const addComissions = (sum: SumOfMoney, broker: IBroker): SumOfMoney => {
	return sum.multiply(1 + broker.share + shareOfStockExcange);
}
/**
 * Цена всего с учётом комиссий покупки
 * @param x
 */
export const calcCurrencyTotallyWithComissions = (
	x: IAсquisitionOfObligation,
	date: Date,
	broker: IBroker
): SumOfMoney => {
	return addComissions(calcCurrencyTotally(x, date), broker);
};
/**
 * Вычисляет процент по облигации на указанную дату
 * @param obligation
 * @param date
 */
const calcPercent = (obligation: Obligation, date: Date): number => {
	return obligation.getOfferDate()
		? isBefore(date, obligation.getOfferDate()!)
			? obligation.getPercent()
			: obligation.getPercentAfterOffer() !== undefined
			? obligation.getPercentAfterOffer()!
			: obligation.getPercent() - 1
		: obligation.getPercent();
};
/**
 * Вычисление НКД
 * @param x
 * @param date
 * @param broker
 */
export const calcACP = (x: IAсquisitionOfObligation, date: Date): SumOfMoney => {
	// FIXME: понять, как считать точнее
	const prevCouponDate = x.obligation.getPreviousCouponDate(date);
	const daysFromPreviousPayment = differenceInDays2(date, prevCouponDate) + 1;
	const result = x.obligation
		.getNominal(date)
		.multiply((daysFromPreviousPayment * calcPercent(x.obligation, date) * x.quantity) / 100 / 365);

	return result;
};
/**
 * Цена с учётом комиссий покупки и НКД
 * @param x
 */
export const calcCurrencyTotallyWithAllComissions = (
	x: IAсquisitionOfObligation,
	date: Date,
	broker: IBroker
): SumOfMoney => {
	const acp = calcACP(x, date);

	return calcCurrencyTotallyWithComissions(x, date, broker).add(acp);
};
/**
 * Цена всего с учётом комиссий покупки, НКД и межбанковского перевода
 * @param x
 */
export const calcCurrencyTotallyWithAllComissionsAndTransfer = (
	x: IAсquisitionOfObligation,
	date: Date,
	broker: IBroker
): SumOfMoney => {
	return calcCurrencyTotallyWithAllComissions(x, date, broker).multiply(1.0 + broker.shareOfinterbankTransfer);
};
/**
 * % налога, с учётом комиссий брокера и биржи, на указанную дату
 * @param x
 */
export const calcTaxPercentOnDate = (obligation: Obligation, date: Date, broker: IBroker): number => {
	if (date.getFullYear() < 2021) {
		const percent = calcPercent(obligation, date);
		const taxPercentFromNominal = 0.35 * (percent - (refinancingRate + 5));
		const taxPercent = (100.0 * taxPercentFromNominal) / percent;
		const remainingValueInPercents = 100.0 - taxPercent;
		const remainingValueAfterComissionsInPercents =
			remainingValueInPercents * (1.0 - broker.share - shareOfStockExcange);
		const taxPercentWithComissionOfBroker = 100.0 - remainingValueAfterComissionsInPercents;

		return Math.max(0.0, taxPercentWithComissionOfBroker);
	} else {
		return 100 * personalIncomeTax;
	}
};
/**
 * Средний % налога, с учётом комиссий брокера и биржи, начиная с dateStart, заканчивая погашением
 * @param x
 */
export const calcTaxPercent = (obligation: Obligation, dateStart: Date, broker: IBroker): number => {
	const dateEnd = obligation.getFinalMaturityDate();
	const couponDates = obligation.getCouponDates(dateStart, dateEnd);
	if (couponDates.length === 0) {
		return calcTaxPercentOnDate(obligation, dateStart, broker);
	}
	const percents = couponDates.map(x => calcTaxPercentOnDate(obligation, x, broker));
	const sum = percents.reduce((x, y) => x + y, 0);

	return sum / percents.length;
};
/**
 * Рассчёт суммы одной выплаты по облигации, с учётом налога
 * @param obligation
 */
export const calcPaymentOnObligationIncludingTaxes = (
	obligation: Obligation,
	date: Date,
	broker: IBroker
): SumOfMoney => {
	const percent = calcPercent(obligation, date);
	const nominal = obligation.getNominal(date);
	const paymentOnYear = nominal.multiply(percent / 100.0);
	const paymentOnObligation = paymentOnYear.multiply(obligation.getPeriodBetweenPayments() / 365.0);
	const taxPercent = calcTaxPercentOnDate(obligation, date, broker);
	const result = paymentOnObligation.multiply((100.0 - taxPercent) / 100.0);

	return result;
};
/**
 * Доход в валюте от даты startDate до даты endDate с одной облигации
 * @param aq
 * @param startDate
 * @param isActualNominalUsed - true - учитывается номинал, который был на момент купонной выплаты, т.е.
 * вычисление реалистично. false - вычисление на основе первоначального номинала для, актуальное при расчётах с
 * реинвестированием
 */
const calcProfitForPeriod = (
	aq: IAсquisitionOfObligation,
	startDate: Date,
	endDate: Date,
	broker: IBroker,
	isActualNominalUsed = true,
): SumOfMoney => {
	const couponDates = aq.obligation.getCouponDates(startDate, endDate);
	if (couponDates.length === 0) {
		return new SumOfMoney(aq.obligation.getCurrency(), 0);
	}

	if (isActualNominalUsed) {
		const result = couponDates
			.map(couponDate => calcPaymentOnObligationIncludingTaxes(aq.obligation, couponDate, broker))
			.reduce((acc, prev) => acc.add(prev), aq.obligation.getNominal(startDate).multiply(0));
	
		return result;
	}

	const firstCouponDate = couponDates[0];

	return calcPaymentOnObligationIncludingTaxes(aq.obligation, firstCouponDate, broker).multiply(couponDates.length);
};
/**
 * Доход в валюте к оферте с одной облигации
 * @param aq
 * @param aqDate дата приобретения
 */
export const calcProfitFromAquisitionToOffer = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): SumOfMoney => {
	if (!aq.obligation.getOfferDate() || isBefore(aq.obligation.getOfferDate()!, aqDate)) {
		return aq.obligation.getNominal(aqDate).empty();
	}

	return calcProfitForPeriod(aq, aqDate, aq.obligation.getOfferDate()!, broker);
};
/**
 * Общий доход в валюте к оферте (со всех облигаций)
 * @param aq
 * @param aqDate
 */
export const calcTotalProfitFromAquisitionToOffer = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): SumOfMoney => {
	if (!aq.obligation.getOfferDate() || isBefore(aq.obligation.getOfferDate()!, aqDate)) {
		return aq.obligation.getNominal(aqDate).empty();
	}

	const profitPerObligation = calcProfitFromAquisitionToOffer(aq, aqDate, broker);

	return profitPerObligation.multiply(aq.quantity);
};
/**
 * Доход в % к оферте
 * @param aq
 * @param aqDate
 */
export const calcProfitFromAquisitionToOfferInPercents = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): IPercent => {
	if (!aq.obligation.getOfferDate() || isBefore(aq.obligation.getOfferDate()!, aqDate)) {
		return createEmptyPercent(aq.obligation);
	}

	const profitPerObligation = calcProfitFromAquisitionToOffer(aq, aqDate, broker);

	return profitPerObligation.multiply(100.0 / aq.obligation.getNominal(aqDate).getValue()).asPercent();
};
/**
 * Доход в % от цены приобретения ко времени оферты
 * @param aq
 * @param aqDate
 */
export const calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): IPercent => {
	if (!aq.obligation.getOfferDate() || isBefore(aq.obligation.getOfferDate()!, aqDate)) {
		return createEmptyPercent(aq.obligation);
	}

	const rawProfit = calcProfitFromAquisitionToOfferInPercents(aq, aqDate, broker);
	if (rawProfit.isEmpty) {
		return rawProfit;
	}

	return {
		...rawProfit,
		value: (rawProfit.value * 100.0) / aq.aquisitionPercent,
	};
};
/**
 * Доход за год в % от цены приобретения ко времени оферты
 */
export const calcProfitForYearInPercentsTillOffer = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): IPercent => {
	const totalProfit = calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice(aq, aqDate, broker);
	if (totalProfit.isEmpty) {
		return totalProfit;
	}

	const daysFromAquisitionToOffer = differenceInDays2(aq.obligation.getOfferDate()!, aqDate);
	if (daysFromAquisitionToOffer <= 0) {
		return createEmptyPercent(aq.obligation);
	}

	return {
		...totalProfit,
		value: Math.min((totalProfit.value * 365) / daysFromAquisitionToOffer, totalProfit.value),
	};
};
/**
 * Затраты на допокупку номинала одной облигации после частичных погашений за период.
 * Вычисления опираются на предположение, что каждый раз нужно будет докупать
 * облигации по цене первоначального приобретения.
 */
const calcReinvestmentExpencesForPeriod = (
	aq: IAсquisitionOfObligation,
	startDate: Date,
	endDate: Date,
	broker: IBroker,
): SumOfMoney => {
	let result = new SumOfMoney(aq.obligation.getCurrency(), 0);

	const maturityPayments = aq.obligation.getMaturityPayments()
		.filter(x => x.date >= startDate && x.date <= endDate && x.date < aq.obligation.getFinalMaturityDate());
	maturityPayments.forEach(({ value }) => {
		const plannedPrice = addComissions(value, broker).addNumber(-value.getValue());

		result = result.add(plannedPrice);
	});

	return result;
}
/**
 * Доход в валюте к погашению с одной облигации
 * @param aq
 * @param aqDate дата приобретения
 * @param isReal - true - нет учёта затрат на реинвестирование. Учёт затрат на реинвестирование
 * полезен для вычисления прибыльности, но не нужен для получения конкретных значений.
 */
export const calcProfitFromAquisitionToMaturity = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker,
	isReal = true,
): SumOfMoney => {
	if (isReal) {
		const profit = calcProfitForPeriod(aq, aqDate, aq.obligation.getFinalMaturityDate(), broker);

		return profit;
	}
	const profit = calcProfitForPeriod(aq, aqDate, aq.obligation.getFinalMaturityDate(), broker, false);
	const expences = calcReinvestmentExpencesForPeriod(aq, aqDate, aq.obligation.getFinalMaturityDate(), broker);

	return profit.addNumber(-expences.getValue());
};
/**
 * Общий доход в валюте к погашению (со всех облигаций одного вида)
 * @param aq
 * @param aqDate
 * @param isReal - true - нет учёта затрат на реинвестирование. Учёт затрат на реинвестирование
 * полезен для вычисления прибыльности, но не нужен для получения конкретных значений.
 */
export const calcTotalProfitFromAquisitionToMaturity = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker,
	isReal = true,
): SumOfMoney => {
	const profitPerObligation = calcProfitFromAquisitionToMaturity(aq, aqDate, broker, isReal);

	return profitPerObligation.multiply(aq.quantity);
};
/**
 * Доход в % от цены приобретения ко времени погашения
 * 
 * 100 * (Доход - НКД) / Цена_приобретения
 * 
 * @param aq
 * @param aqDate
 */
export const calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): IPercent => {
	if (aq.quantity === 0) {
		return calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice(
			{ 
				...aq,
				quantity: 1,
			},
			aqDate,
			broker
		);
	}
	const profit = calcTotalProfitFromAquisitionToMaturity(aq, aqDate, broker, false);
	const acp = calcACP(aq, aqDate);
	const aqPrice = calcCurrencyTotallyWithComissions(aq, aqDate, broker);

	return profit
		.addNumber(-acp.getValue())
		.multiply(100.0 / aqPrice.getValue()).asPercent();
};
/**
 * Доход за год в % от цены приобретения ко времени погашения
 */
export const calcProfitForYearInPercentsTillMaturity = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	broker: IBroker
): IPercent => {
	const totalProfit = calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice(aq, aqDate, broker);

	const daysFromAquisitionToMaturity = differenceInDays2(aq.obligation.getFinalMaturityDate(), aqDate);
	if (daysFromAquisitionToMaturity <= 365) {
		return createEmptyPercent(aq.obligation);
	}

	return {
		...totalProfit,
		value: (totalProfit.value * 365) / daysFromAquisitionToMaturity,
	};
};
/**
 * Вычисляет стоимость приобретений. Конкретная функция вычисления стоимости передаётся в calculator
 * @param aquisitions
 */
export const calcSumsOfAquisitions = (
	aquisitions: IAсquisitionOfObligation[],
	calculator: (aq: IAсquisitionOfObligation, date: Date, broker: IBroker) => SumOfMoney,
	date: Date,
	broker: IBroker
): SumOfMoney[] => {
	const sums = aquisitions.map(aq => calculator(aq, date, broker)).filter(x => !x.isEmpty());

	return SumOfMoney.reduceArray(sums);
};
/**
 * Наименьший процент, с которого начинается вычисление желаемой цены (calcProfitForYearInPercentsTillMaturity).
 * Если реальный результат меньше этого числа, то отображаемый результат будет пустым.
 */
const minAvailiblePercent = 0.001;
/**
 * Наибольший процент, с которого начинается вычисление желаемой цены (calcProfitForYearInPercentsTillMaturity).
 * Если реальный результат больше этого числа, то отображаемый результат будет пустым.
 */
const maxAvailiblePercent = 200.0;
/**
 * Сколько раз будет предпринята попытка вычислить желаемую цену (calcProfitForYearInPercentsTillMaturity).
 * Если за это количество попыток нужная точность решения не будет достигнута, то 
 * отображаемый результат будет пустым.
 */
const maxNumberOfAllowedIterations = 16;
/**
 * Точность решения при вычислении желаемой цены (calcProfitForYearInPercentsTillMaturity).
 */
const minAbsoluteDifference = 0.01;
/**
 * Рассчитывает цену приобретения облигации, которая обеспечивала бы доход ровно в percent
 * процентов в год (calcProfitForYearInPercentsTillMaturity). Принцип вычисления - расчёт
 * обратного значения функции методом пузырька.
 * @param aq
 * @param percent
 */
export const calcWantedPrice = (
	aq: IAсquisitionOfObligation,
	aqDate: Date,
	percent: number,
	broker: IBroker
): IPercent => {
	let counter = 0;

	let start = minAvailiblePercent;
	let end = maxAvailiblePercent;
	let aquisitionPercent = (end + start) / 2.0;
	while (counter < maxNumberOfAllowedIterations) {
		counter++;

		const aquisition = {
			...aq,
			aquisitionPercent,
		};

		const profitPercent = calcProfitForYearInPercentsTillMaturity(aquisition, aqDate, broker);

		const difference = profitPercent.value - percent;
		if (Math.abs(difference) < minAbsoluteDifference) {
			return {
				...profitPercent,
				value: aquisitionPercent,
			} as IPercent;
		} else if (difference < 0) {
			end = aquisitionPercent;
			aquisitionPercent = (aquisitionPercent + start) / 2.0;
		} else {
			start = aquisitionPercent;
			aquisitionPercent = (end + aquisitionPercent) / 2.0;
		}
	}

	return createEmptyPercent(aq.obligation);
};
/**
 * Округление числа до 2 знаков после запятой
 * @param value
 */
export const moneyValue = (value: number): number => {
	return +value.toFixed(2);
};
/**
 * Количество частичных погашений от даты приобретения до полного погашения
 * @param aq 
 * @param aqDate 
 * @returns 
 */
export const getNumberOfPartialMaturities = (aq: IAсquisitionOfObligation, aqDate: Date): number | null => {
	const result = aq.obligation.getMaturityPayments().filter(({ date }) => date > aqDate).length - 1;

	return result || null;
}