import { IMassiveAсquisitionOfObligations } from '../interfaces/IMassiveAсquisitionOfObligations';
import { massiveAquisitions } from '../data/massiveAquisitions';
import { IEventWithObligation } from '../interfaces/IEventWithObligation';
import { calcPaymentOnObligationIncludingTaxes } from './common';
import { addMonths } from 'date-fns';
import { Obligation } from '../classes/Obligation';
import { IBroker } from '../interfaces/IBroker';

interface IPartialAсquisitionOfObligation {
	/**
	 * Дата приобретения
	 */
	aqDate: Date;
	broker: IBroker;
	obligation: Obligation;
	quantity: number;
}

/**
 * Создаёт события погашения облигаций
 */
const calcEventsWithMaturities = (
	aquisitions: IPartialAсquisitionOfObligation[],
	dateOfStart: Date,
	dateOfEnd: Date
): IEventWithObligation[] => {
	const result = [] as IEventWithObligation[];

	for (let a = 0; a < aquisitions.length; ++a) {
		const aquisition = aquisitions[a];
		const payments = aquisition.obligation.getMaturityPayments().filter(x => x.date > aquisition.aqDate);
		const isPartial = payments.length > 1;

		for (let b = 0; b < payments.length; ++b) {
			const currentPayment = payments[b];

			if (currentPayment.date >= dateOfStart && currentPayment.date <= dateOfEnd) {
				result.push({
					date: currentPayment.date,
					broker: aquisition.broker,
					obligation: aquisition.obligation,
					profit: currentPayment.value.multiply(aquisition.quantity),
					quantity: aquisition.quantity,
					type: isPartial ? 'Частичное погашение' : 'Погашение',
				});
			}
		}
	}

	return result;
};
/**
 * Создаёт события купонных выплат
 */
const calcEventsWithCouponPayments = (
	aquisitions: IPartialAсquisitionOfObligation[],
	dateOfStart: Date,
	dateOfEnd: Date
) => {
	return aquisitions
		.map(x =>
			x.obligation
				.getCouponDates(dateOfStart, dateOfEnd)
				.filter(date => date > x.aqDate)
				.map(date => {
					const profitOnObligation = calcPaymentOnObligationIncludingTaxes(x.obligation, date, x.broker);

					return {
						broker: x.broker,
						date,
						profit: profitOnObligation.multiply(x.quantity),
						type: 'Выплата купона',
						obligation: x.obligation,
						quantity: x.quantity,
					} as IEventWithObligation;
				})
		)
		.flatMap(x => x);
};
/**
 * Создаёт события оферт
 */
const calcEventsWithOffers = (aquisitions: IPartialAсquisitionOfObligation[], dateOfStart: Date, dateOfEnd: Date) => {
	return aquisitions
		.filter(
			x => {
				const offerDate = x.obligation.getOfferDate();
				
				return !!offerDate &&
					offerDate >= dateOfStart &&
					offerDate <= dateOfEnd &&
					offerDate > x.aqDate;
			}
		)
		.map(
			x =>
				({
					date: x.obligation.getOfferDate()!,
					profit: x.obligation.getNominal(dateOfStart).empty(),
					type: 'Оферта',
					...x,
				} as IEventWithObligation)
		);
};
/**
 * Удаляет дубликаты и складывает суммы купонов, которые приходятся на один и тот же день и одну
 * и ту же облигацию одного и того же брокера
 * @param events
 */
const collapseEvents = (events: IEventWithObligation[]): IEventWithObligation[] => {
	const result = events.slice() as (IEventWithObligation | null)[];

	for (let a = 0; a < result.length; ++a) {
		const first = result[a];
		if (!first) {
			continue;
		}

		for (let b = a + 1; b < result.length; ++b) {
			const second = result[b];
			if (!second) {
				continue;
			}

			if (
				first.date.getTime() === second.date.getTime() &&
				first.obligation === second.obligation &&
				first.type === second.type &&
				first.broker === second.broker
			) {
				first.profit = first.profit.add(second.profit);
				first.quantity += second.quantity;

				result[b] = null;
			}
		}
	}

	return result.filter(Boolean) as IEventWithObligation[];
};
/**
 * Хранилище данных о приобретениях
 */
class Depository {
	constructor(private massiveAquisitions: IMassiveAсquisitionOfObligations[]) {}

	public getMassiveAquisitions(year?: number): IMassiveAсquisitionOfObligations[] {
		return year && Number.isInteger(year)
			? this.massiveAquisitions.filter(x => x.date.getFullYear() === year)
			: this.massiveAquisitions;
	}
	/**
	 * Возвращает список облигаций с указанием их количества
	 */
	private getPartialAquisitions(): IPartialAсquisitionOfObligation[] {
		const result = [] as IPartialAсquisitionOfObligation[];

		this.massiveAquisitions.forEach(x => {
			x.aquisitions.forEach(y => {
				result.push({
					aqDate: x.date,
					broker: x.broker,
					obligation: y.obligation,
					quantity: y.quantity,
				});
			});
		});

		return result;
	}
	/**
	 * События на следующие 13 месяцев и предыдущий месяц
	 */
	public getEventsWithObligationsForNextYear(): IEventWithObligation[] {
		const dateOfStart = addMonths(new Date(), -1);
		const dateOfEnd = addMonths(dateOfStart, 13);
		const aquisitions = this.getPartialAquisitions();

		const payments = collapseEvents(calcEventsWithCouponPayments(aquisitions, dateOfStart, dateOfEnd));
		const offers = collapseEvents(calcEventsWithOffers(aquisitions, dateOfStart, dateOfEnd));
		const maturities = collapseEvents(calcEventsWithMaturities(aquisitions, dateOfStart, dateOfEnd));

		return [...payments, ...offers, ...maturities].sort((x, y) => x.date.getTime() - y.date.getTime());
	}
}
/**
 * Хранилище данных о приобретениях
 */
export const depository = new Depository(massiveAquisitions);
