import React, { FC, Fragment, useReducer } from 'react';
import { IMassiveAсquisitionOfObligations } from '../../interfaces/IMassiveAсquisitionOfObligations';
import {Header1Date, Header2Name, Header2Price, Header, Header2Payments, Header2Analytics, Header2Dates, TableRoot, Root, Input, BrokerIcon} from './TableOfObligations.styled';
import {calcCurrencyPerObligation, calcCurrencyTotally, calcCurrencyTotallyWithComissions, calcCurrencyTotallyWithAllComissions, calcCurrencyTotallyWithAllComissionsAndTransfer, calcTaxPercent, calcProfitFromAquisitionToMaturity, calcTotalProfitFromAquisitionToMaturity, calcProfitFromAquisitionToOffer, calcTotalProfitFromAquisitionToOffer, calcProfitFromAquisitionToOfferInPercents, calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice, calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice, calcProfitForYearInPercentsTillOffer, calcProfitForYearInPercentsTillMaturity, calcACP, getNumberOfPartialMaturities} from '../../utils/common';
import { IAсquisitionOfObligation } from '../../interfaces/IAсquisitionOfObligation';
import { stringifyDate, money, percent, percentFromNumber } from '../../utils/jsx';
import { calcDaysTillOffer, calcDaysTillMaturity } from '../../utils/date-time';
import { AquisitionInfo } from '../AquisitionInfo/AquisitionInfo';
import { calcRowData } from './TableOfObligations.utils';

interface IProps {
	data: IMassiveAсquisitionOfObligations;
	isEditable: boolean;
}
/**
 * Таблица с облигациями
 */
export const TableOfObligations: FC<IProps> = ({ data, isEditable }) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const { aquisitions, date, broker } = data;

	return (
		<Root>
			<TableRoot color={broker.color}>
				<Header1Date>
					<BrokerIcon alt={broker.name} src={broker.logo} />
					{stringifyDate(date)}
				</Header1Date>
				<Header2Name>Название</Header2Name>
				<Header />
				<Header2Price>Цена приобретения</Header2Price>
				<Header />
				<Header2Dates>Даты</Header2Dates>
				<Header2Payments>Выплаты</Header2Payments>
				<Header2Analytics>Аналитика</Header2Analytics>
				<Header>В QUIK</Header>
				<Header>В отчёте</Header>
				<Header>ISIN</Header>
				<Header>Количество</Header>
				<Header>% от номинала</Header>
				<Header>Цена одной облигации</Header>
				<Header>Цена</Header>
				<Header>Цена с учётом комиссий покупки</Header>
				<Header>НКД</Header>
				<Header>Цена с учётом комиссий покупки и НКД</Header>
				<Header>Цена с учётом комиссий покупки, НКД и межбанковского перевода</Header>
				<Header>Номинал</Header>
				<Header>Ближайшая выплата купона</Header>
				<Header>Дата оферты</Header>
				<Header>Дней до оферты</Header>
				<Header>Дата погашения</Header>
				<Header>Дней до погашения</Header>

				<Header>% годовой</Header>
				<Header>Средний % налогов и комиссий</Header>
				<Header>Период между выплатами в днях</Header>
				<Header>Всего выплат начиная с даты покупки</Header>
				<Header>Количество частичных погашений</Header>

				<Header>Цена в % от номинала, обеспечивающая доходность 12% в год</Header>
				<Header>Доход ко времени оферты с одной облигации</Header>
				<Header>Доход ко времени оферты</Header>
				<Header>Доход в % от номинала в оферте</Header>
				<Header>Доход в % от цены приобретения к оферте</Header>
				<Header>Годовой доход в % от цены приобретения к оферте</Header>
				<Header>Доход ко времени погашения с одной облигации</Header>
				<Header>Доход ко времени погашения</Header>
				<Header>Доход в % от цены приобретения ко времени погашения</Header>
				<Header>Годовой доход в % от цены приобретения ко времени погашения</Header>
				{aquisitions.map((x: IAсquisitionOfObligation, i) => {
					const { Cell, wantedPrice } = calcRowData(x, date, isEditable, broker);

					return (
						<Fragment key={i}>
							<Cell>{x.obligation.getName()}</Cell>
							<Cell>{x.obligation.getLongName()}</Cell>
							<Cell>{x.obligation.getISIN()}</Cell>

							{isEditable && (
								<>
									<Cell>
										<Input
											onChange={event => {
												x.quantity = Math.abs(Math.floor(+event.target.value));
												forceUpdate();
											}}
											type='number'
											value={x.quantity}
										/>
									</Cell>
									<Cell>
										<Input
											onChange={event => {
												x.aquisitionPercent = +event.target.value;
												forceUpdate();
											}}
											step={0.01}
											type='number'
											value={x.aquisitionPercent}
										/>
									</Cell>
								</>
							)}
							{!isEditable && (
								<>
									<Cell>{x.quantity}</Cell>
									<Cell>{percentFromNumber(x.aquisitionPercent)}</Cell>
								</>
							)}
							<Cell>{money(calcCurrencyPerObligation(x, date))}</Cell>
							<Cell>{money(calcCurrencyTotally(x, date))}</Cell>
							<Cell>{money(calcCurrencyTotallyWithComissions(x, date, broker))}</Cell>
							<Cell>{money(calcACP(x, date))}</Cell>
							<Cell>{money(calcCurrencyTotallyWithAllComissions(x, date, broker))}</Cell>
							<Cell>{money(calcCurrencyTotallyWithAllComissionsAndTransfer(x, date, broker))}</Cell>

							<Cell>{money(x.obligation.getNominal(date))}</Cell>

							<Cell>{stringifyDate(x.obligation.getNextCouponDate(new Date()))}</Cell>
							<Cell>{stringifyDate(x.obligation.getOfferDate())}</Cell>
							<Cell>{calcDaysTillOffer(x, date)}</Cell>
							<Cell>{stringifyDate(x.obligation.getFinalMaturityDate())}</Cell>
							<Cell>{calcDaysTillMaturity(x, date)}</Cell>

							<Cell>{percentFromNumber(x.obligation.getPercent())}</Cell>
							<Cell>{percentFromNumber(calcTaxPercent(x.obligation, date, broker))}</Cell>
							<Cell>{x.obligation.getPeriodBetweenPayments()}</Cell>
							<Cell>{x.obligation.getNumberOfCouponDates(date, x.obligation.getFinalMaturityDate())}</Cell>
							<Cell>{getNumberOfPartialMaturities(x, date)}</Cell>

							<Cell>{percent(wantedPrice)}</Cell>
							<Cell>{money(calcProfitFromAquisitionToOffer(x, date, broker))}</Cell>
							<Cell>{money(calcTotalProfitFromAquisitionToOffer(x, date, broker))}</Cell>
							<Cell>{percent(calcProfitFromAquisitionToOfferInPercents(x, date, broker))}</Cell>
							<Cell>
								{percent(calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice(x, date, broker))}
							</Cell>
							<Cell>{percent(calcProfitForYearInPercentsTillOffer(x, date, broker))}</Cell>
							<Cell>{money(calcProfitFromAquisitionToMaturity(x, date, broker))}</Cell>
							<Cell>{money(calcTotalProfitFromAquisitionToMaturity(x, date, broker))}</Cell>
							<Cell>
								{percent(
									calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice(x, date, broker)
								)}
							</Cell>
							<Cell>{percent(calcProfitForYearInPercentsTillMaturity(x, date, broker))}</Cell>
						</Fragment>
					);
				})}
			</TableRoot>
			<AquisitionInfo data={data} />
		</Root>
	);
};
