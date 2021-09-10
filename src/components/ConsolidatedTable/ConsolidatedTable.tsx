import React, { FC, Fragment } from 'react';
import { IMassiveAсquisitionOfObligations } from '../../interfaces/IMassiveAсquisitionOfObligations';
import { Root, HeaderCell, Cell, TableRoot } from './ConsolidatedTable.styled';
import { percent, money, sumOfMoney } from '../../utils/jsx';
import { prepareConsolidatedData } from './ConsolidatedTable.util';
import { Info } from '../styled';

interface IProps {
	children?: never;
	list: IMassiveAсquisitionOfObligations[];
}
/**
 * Сводная таблица
 */
export const ConsolidatedTable: FC<IProps> = ({ list }) => {
	const { consolidatedList, totals } = prepareConsolidatedData(list, new Date());

	return (
		<Root>
			<TableRoot>
				<HeaderCell>Название</HeaderCell>
				<HeaderCell>ISIN</HeaderCell>
				<HeaderCell>Количество</HeaderCell>
				<HeaderCell>Номинал</HeaderCell>
				<HeaderCell>Доля в портфеле</HeaderCell>
				{consolidatedList.map(x => (
					<Fragment key={x.isin}>
						<Cell>{x.name}</Cell>
						<Cell>{x.isin}</Cell>
						<Cell>{x.quantity}</Cell>
						<Cell>{money(x.nominal)}</Cell>
						<Cell>
							{percent(x.share)}% ({x.share.currency.sign})
						</Cell>
					</Fragment>
				))}
			</TableRoot>
			<Info>
				Всего по номиналу:&nbsp;
				{sumOfMoney(totals)}
			</Info>
		</Root>
	);
};
