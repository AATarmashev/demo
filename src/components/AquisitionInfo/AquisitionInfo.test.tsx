import { calcAverageValue } from './AquisitionInfo.util';
import { date } from '../../utils/date-time';
import { obligations } from '../../data/obligations';
import { IMassiveAсquisitionOfObligations } from '../../interfaces/IMassiveAсquisitionOfObligations';
import {
	calcProfitForYearInPercentsTillMaturity,
	calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice,
	calcProfitFromAquisitionToOfferInPercents,
	calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice,
	calcProfitForYearInPercentsTillOffer,
} from '../../utils/common';

export const testAquisition1 = {
	aquisitions: [
		{
			aquisitionPercent: 103.0,
			obligation: obligations.Компания 3,
			quantity: 1,
		},
	],
	date: date('17.11.2020'),
} as IMassiveAсquisitionOfObligations;

export const testAquisition2 = {
	aquisitions: [
		{
			aquisitionPercent: 103.0,
			obligation: obligations.Компания 3,
			quantity: 10,
		},
	],
	date: date('17.11.2020'),
} as IMassiveAсquisitionOfObligations;

const calculators = [
	calcProfitFromAquisitionToOfferInPercents,
	calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice,
	calcProfitForYearInPercentsTillOffer,

	calcProfitForYearInPercentsTillMaturity,
	calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice,
];

test('AquisitionInfo calcAverageValue', () => {
	calculators.forEach(calculator => {
		const percent = calculator(testAquisition1.aquisitions[0], testAquisition1.date);

		const averagePercent = calcAverageValue(testAquisition1.aquisitions, testAquisition1.date, calculator);

		expect(averagePercent.length).toBe(1);
		expect(percent.currency).toBe(averagePercent[0].currency);
		expect(percent.value).toBe(averagePercent[0].value);
	});

	calculators.forEach(calculator => {
		const percent = calculator(testAquisition2.aquisitions[0], testAquisition2.date);

		const averagePercent = calcAverageValue(testAquisition2.aquisitions, testAquisition2.date, calculator);

		expect(averagePercent.length).toBe(1);
		expect(percent.currency).toBe(averagePercent[0].currency);
		expect(percent.value).toBe(averagePercent[0].value);
	});
});
