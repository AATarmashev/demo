import { IAсquisitionOfObligation } from '../../interfaces/IAсquisitionOfObligation';
import { ICurrency } from '../../data/currencies';
import { createEmptyPercentFromCurrency } from '../../utils/percents';
import { calcTotalProfitFromAquisitionToMaturity } from '../../utils/common';
import { SumOfMoney } from '../../classes/SumOfMoney';
import { IPercent } from '../../interfaces/IPercent';
import { IBroker } from '../../interfaces/IBroker';
/**
 * Вычисляет средний результат применения функции calculator ко всем приобретениям.
 * Должна быть только одна валюта.
 * @param aquisitions
 * @param aqDate
 * @param calculator
 */
const calcAverageValueForOneCurrency = (
	currency: ICurrency,
	aquisitions: IAсquisitionOfObligation[],
	aqDate: Date,
	calculator: (aq: IAсquisitionOfObligation, aqDate: Date, broker: IBroker) => IPercent,
	broker: IBroker
): IPercent => {
	let totalValueOfObligations = 0;

	const sum = aquisitions
		.map(aq => {
			const percent = calculator(aq, aqDate, broker);
			// FIXME: разобраться с номиналом
			const relativeValue = aq.quantity * aq.obligation.getNominal(aqDate).getValue();

			if (!percent.isEmpty) {
				totalValueOfObligations += relativeValue;
			}

			return percent.value * relativeValue;
		})
		.reduce((curr, prev) => prev + curr, 0);

	if (totalValueOfObligations === 0) {
		return createEmptyPercentFromCurrency(currency);
	}

	return {
		currency,
		value: sum / totalValueOfObligations,
	};
};
/**
 * Вычисляет средний результат применения функции calculator ко всем приобретениям
 * @param aquisitions
 * @param aqDate
 * @param calculator
 */
export const calcAverageValue = (
	aquisitions: IAсquisitionOfObligation[],
	aqDate: Date,
	calculator: (aq: IAсquisitionOfObligation, aqDate: Date, broker: IBroker) => IPercent,
	broker: IBroker
): IPercent[] => {
	const currencies = new Set(aquisitions.map(x => x.obligation.getCurrency()));

	const result = Array.from(currencies).map(currency => {
		const aquisitionsWithOneCurrency = aquisitions.filter(aq => aq.obligation.getCurrency() === currency);

		return calcAverageValueForOneCurrency(currency, aquisitionsWithOneCurrency, aqDate, calculator, broker);
	});

	return result;
};
/**
 * Расчёт суммарного дохода от приобретения облигаций
 */
export const calcTotalProfit = (
	aquisitions: IAсquisitionOfObligation[],
	aqDate: Date,
	broker: IBroker
): SumOfMoney[] => {
	const profits = aquisitions.map(aq => calcTotalProfitFromAquisitionToMaturity(aq, aqDate, broker));

	return SumOfMoney.reduceArray(profits);
};
/**
 * Расчёт суммы всех выплат от приобретения облигаций, включая погашения
 */
export const calcTotalOutcome = (
	aquisitions: IAсquisitionOfObligation[],
	aqDate: Date,
	broker: IBroker
): SumOfMoney[] => {
	const totalProfit = calcTotalProfit(aquisitions, aqDate, broker);
	// FIXME: разобраться с номиналом
	const sumOfNominals = aquisitions.map(aq => aq.obligation.getNominal(aqDate).multiply(aq.quantity));
	const result = SumOfMoney.reduceArray([...totalProfit, ...sumOfNominals]);

	return result;
};
