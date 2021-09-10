import React, { FC, useMemo } from 'react';
import { IMassiveAсquisitionOfObligations } from '../interfaces/IMassiveAсquisitionOfObligations';
import { obligations } from '../data/obligations';
import { IAсquisitionOfObligation } from '../interfaces/IAсquisitionOfObligation';
import { TableOfObligations } from '../components/TableOfObligations/TableOfObligations';
import { IBroker } from '../interfaces/IBroker';

interface Props {
	broker: IBroker;
}
/**
 * Страница оценки возможных приобретений
 */
export const EstimationPage: FC<Props> = ({ broker }) => {
	const data = useMemo(
		() =>
			({
				aquisitions: Object.values(obligations)
					.filter(x => !x.getOfferDate() || x.getPercentAfterOffer() !== undefined)
					.map(
						obligation =>
							({
								aquisitionPercent: 100,
								obligation,
								quantity: 0,
							} as IAсquisitionOfObligation)
					),
				broker,
				date: new Date(),
			} as IMassiveAсquisitionOfObligations),
		[broker]
	);

	if (!broker) {
		return null;
	}

	return <TableOfObligations data={data} isEditable />;
};
