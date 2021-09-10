import React, { FC } from 'react';
import { TableOfObligations } from '../components/TableOfObligations/TableOfObligations';
import { depository } from '../utils/depository';
/**
 * Страница приобретений
 */
export const AquisitionsPage: FC = () => {
	const year = Number.parseInt(window.location.pathname.split('/').pop() || 'NaN');

	return (
		<>
			{depository.getMassiveAquisitions(year).map((x, i) => (
				<TableOfObligations data={x} isEditable={false} key={i} />
			))}
		</>
	);
};
