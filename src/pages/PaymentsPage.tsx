import React, { FC } from 'react';
import { depository } from '../utils/depository';
import { TableOfEventsWithObligations } from '../components/TableOfEventsWithObligations.ts/TableOfEventsWithObligations';

/**
 * Страница с данными платежей
 */
export const PaymentsPage: FC = () => {
	return <TableOfEventsWithObligations events={depository.getEventsWithObligationsForNextYear()} />;
};
