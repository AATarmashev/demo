import React, { FC } from 'react';
import { depository } from '../utils/depository';
import { ConsolidatedTable } from '../components/ConsolidatedTable/ConsolidatedTable';
/**
 * Страница со сводными данными
 */
export const ConsolidatedPage: FC = () => {
	return <ConsolidatedTable list={depository.getMassiveAquisitions()} />;
};
