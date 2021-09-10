import React, { FC } from 'react';
import { IMassiveAсquisitionOfObligations } from '../../interfaces/IMassiveAсquisitionOfObligations';
import { Averages, AveragesContent } from './AquisitionInfo.styled';
import {
	calcCurrencyTotallyWithAllComissions,
	calcCurrencyTotallyWithAllComissionsAndTransfer,
	calcSumsOfAquisitions,
	calcProfitFromAquisitionToOfferInPercents,
	calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice,
	calcProfitForYearInPercentsTillOffer,
	calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice,
	calcProfitForYearInPercentsTillMaturity,
} from '../../utils/common';
import { sumOfMoney, sumOfPercents } from '../../utils/jsx';
import { calcAverageValue, calcTotalProfit, calcTotalOutcome } from './AquisitionInfo.util';
import { Info } from '../styled';

interface IProps {
	data: IMassiveAсquisitionOfObligations;
}
/**
 * Блок с обобщающей информацией по приобретению
 */
export const AquisitionInfo: FC<IProps> = ({ data }) => {
	const { aquisitions, date, broker } = data;

	const sum = calcSumsOfAquisitions(aquisitions, calcCurrencyTotallyWithAllComissions, date, broker);
	const sumIncludingTransfer = calcSumsOfAquisitions(
		aquisitions,
		calcCurrencyTotallyWithAllComissionsAndTransfer,
		date,
		broker
	);

	return (
		<>
			<Info>Общая стоимость покупки: {sumOfMoney(sum)}</Info>
			<Info>Общая стоимость покупки с учётом комиссии на ввод средств: {sumOfMoney(sumIncludingTransfer)}</Info>
			<Averages>
				<Info>Средние значения:</Info>
				<AveragesContent>
					<Info>
						Доход в % от номинала в оферте:&nbsp;
						{sumOfPercents(
							calcAverageValue(aquisitions, date, calcProfitFromAquisitionToOfferInPercents, broker)
						)}
					</Info>
					<Info>
						Доход в % от цены приобретения к оферте:&nbsp;
						{sumOfPercents(
							calcAverageValue(
								aquisitions,
								date,
								calcProfitFromAquisitionToOfferInPercentsByAquisitionPrice,
								broker
							)
						)}
					</Info>
					<Info>
						Годовой доход в % от цены приобретения к оферте:&nbsp;
						{sumOfPercents(
							calcAverageValue(aquisitions, date, calcProfitForYearInPercentsTillOffer, broker)
						)}
					</Info>
					<Info>
						Доход в % от цены приобретения ко времени погашения:&nbsp;
						{sumOfPercents(
							calcAverageValue(
								aquisitions,
								date,
								calcProfitFromAquisitionToMaturityInPercentsByAquisitionPrice,
								broker
							)
						)}
					</Info>
					<Info>
						Годовой доход в % от цены приобретения ко времени погашения:&nbsp;
						{sumOfPercents(
							calcAverageValue(aquisitions, date, calcProfitForYearInPercentsTillMaturity, broker)
						)}
					</Info>
				</AveragesContent>
				<Info>Суммарные значения:</Info>
				<AveragesContent>
					<Info>
						Суммарный доход:&nbsp;
						{sumOfMoney(calcTotalProfit(aquisitions, date, broker))}
					</Info>
					<Info>
						Денег к возврату:&nbsp;
						{sumOfMoney(calcTotalOutcome(aquisitions, date, broker))}
					</Info>
				</AveragesContent>
			</Averages>
		</>
	);
};
