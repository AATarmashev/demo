import React, { FC, Fragment } from 'react';
import {Root, MainHeader, Header, Cell, Month, BrokerIcon} from './TableOfEventsWithObligations.styled';
import { IEventWithObligation } from '../../interfaces/IEventWithObligation';
import { calcPositionsOfMonthsSumms } from './TableOfEventsWithObligations.util';
import { money, stringifyDate, sumOfMoney } from '../../utils/jsx';
import { isPast, isSameDay } from 'date-fns';
import { ISummObject } from './TableOfEventsWithObligations.declarations';

interface ITableOfEventsWithObligationsProps {
	events: IEventWithObligation[];
}
/**
 * Таблица событий с облигациями
 */
export const TableOfEventsWithObligations: FC<ITableOfEventsWithObligationsProps> = ({ events }) => {
	const positionsForSumms = calcPositionsOfMonthsSumms(events);

	return (
		<Root>
			<MainHeader>События с облигациями на ближайшие 13 месяцев и предыдущий месяц</MainHeader>
			<Header>Дата</Header>
			<Header>Брокер</Header>
			<Header>Тип</Header>
			<Header>Наименование облигации</Header>
			<Header>Доход</Header>
			<Header>Доход за месяц</Header>
			{events.map((event: IEventWithObligation, index) => {
				const hasWarning = event.type === 'Оферта' || event.type === 'Погашение';
				const isInPast = isPast(event.date);
				const isToday = isSameDay(event.date, new Date());
				const highlight = isToday
					? 'Сегодня'
					: hasWarning
						? 'Предупреждение'
						: isInPast
							? 'В прошлом'
							: '';
				const sumObject = positionsForSumms.find(pfs => pfs.index === index) as ISummObject;

				return (
					<Fragment key={index}>
						<Cell highlight={highlight}>
							{stringifyDate(event.date)}
						</Cell>
						<Cell highlight={highlight} title={event.broker.name}>
							<BrokerIcon alt={event.broker.name} src={event.broker.logo} />
						</Cell>
						<Cell highlight={highlight}>
							{event.type}
						</Cell>
						<Cell highlight={highlight}>
							{event.obligation.getName()}
						</Cell>
						<Cell highlight={highlight}>
							{money(event.profit)}
						</Cell>
						<Cell highlight=''>
							{sumObject && <Month height={sumObject.height}>{sumOfMoney(sumObject.sums)}</Month>}
						</Cell>
					</Fragment>
				);
			})}
		</Root>
	);
};
