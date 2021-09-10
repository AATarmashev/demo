import { IEventWithObligation } from '../../interfaces/IEventWithObligation';
import { ISummObject } from './TableOfEventsWithObligations.declarations';

/**
 * Рассчитывает индексы строк, на которых начинается месяц, высоты месяцев в пикселях и сами месячные суммы.
 * @param events
 */
export const calcPositionsOfMonthsSumms = (events: IEventWithObligation[]): ISummObject[] => {
	const entries = new Map<string, ISummObject>();

	events.forEach((x, index) => {
		const monthYearString = `${x.date.getMonth()}.${x.date.getFullYear()}`;
		const currentSum = x.profit.asNotEmpty();

		const object = entries.get(monthYearString);
		if (object) {
			object.height += 31;

			const indexOfCurrentSum = object.sums.findIndex(x => x.getCurrency() === currentSum.getCurrency());

			if (indexOfCurrentSum > -1) {
				object.sums[indexOfCurrentSum] = object.sums[indexOfCurrentSum].add(currentSum);
			} else {
				object.sums.push(currentSum);
			}
		} else {
			entries.set(monthYearString, {
				height: 30,
				index,
				sums: [currentSum],
			});
		}
	});

	return Array.from(entries.values());
};
