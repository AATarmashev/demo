import { IMassiveAсquisitionOfObligations } from '../../interfaces/IMassiveAсquisitionOfObligations';
import { IConsolidatedTableEntry } from './ConsolidatedTable.declarations';
import { SumOfMoney } from '../../classes/SumOfMoney';
/**
 * Готовит сводные данные по приобретениям облигаций без вычисления долей
 * @param list
 */
const createConsolidatedList = (list: IMassiveAсquisitionOfObligations[], date: Date): IConsolidatedTableEntry[] => {
	const splitList = list.flatMap(x => x.aquisitions);
	const obligations = Array.from(new Set(splitList.map(x => x.obligation)));

	return obligations
		.map(x => {
			const quantity = splitList.filter(y => y.obligation === x).reduce((prev, curr) => prev + curr.quantity, 0);

			return {
				isin: x.getISIN(),
				name: x.getName(),
				nominal: x.getNominal(date),
				quantity,
				share: { currency: x.getCurrency(), value: 0 },
			} as IConsolidatedTableEntry;
		})
		.sort((x, y) => x.name.localeCompare(y.name));
};
/**
 * Считает сумму номиналов по сводным данным облигаций
 * @param list
 */
const calcTotalNominalFromConsolidatedData = (list: IConsolidatedTableEntry[]): SumOfMoney[] => {
	const nominals = list.map(x => x.nominal.multiply(x.quantity));

	return SumOfMoney.reduceArray(nominals);
};
/**
 * Вычисляет доли для сводных данных облигаций
 * @param unpreparedConsolidatedList
 * @param totals
 */
const prepareConsolidatedList = (
	unpreparedConsolidatedList: IConsolidatedTableEntry[],
	totals: SumOfMoney[]
): IConsolidatedTableEntry[] => {
	return unpreparedConsolidatedList.map(x => {
		const requiredNominal = totals.find(y => y.getCurrency() === x.nominal.getCurrency());
		if (!requiredNominal) {
			console.error(x, totals);

			throw new Error('Ошибка вычисления долей облигаций: номинал в нужной валюте не найден.');
		}
		const value = (100 * x.nominal.getValue() * x.quantity) / requiredNominal.getValue();

		return {
			...x,
			share: {
				...x.share,
				value,
			},
		};
	});
};
/**
 * Вычисляет сводные данные по приобретениям облигаций
 * @param list
 */
export const prepareConsolidatedData = (list: IMassiveAсquisitionOfObligations[], date: Date) => {
	const unpreparedConsolidatedList = createConsolidatedList(list, date);
	const totals = calcTotalNominalFromConsolidatedData(unpreparedConsolidatedList);
	const consolidatedList = prepareConsolidatedList(unpreparedConsolidatedList, totals);

	return {
		consolidatedList,
		totals,
	};
};
