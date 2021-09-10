import { calcWantedPrice } from '../../utils/common';
import { memoize } from '../../utils/memoization';
import { IAсquisitionOfObligation } from '../../interfaces/IAсquisitionOfObligation';
import { NormalCell, OrangeCell, YellowCell } from './TableOfObligations.styled';
import { StyledComponent } from 'styled-components';
import { createEmptyPercent } from '../../utils/percents';
import { IBroker } from '../../interfaces/IBroker';

/**
 * Вычисляет, каким цветом красить строки в таблице
 * @param price
 * @param wantedPrice
 * @param isEditable
 */
const getCellComponentForRow = (
	price: number,
	wantedPrice: number,
	isEditable: boolean
): StyledComponent<'div', any, {}, never> => {
	if (!isEditable) {
		return NormalCell;
	}
	if (wantedPrice - price <= -1.0) {
		return OrangeCell;
	}
	if (wantedPrice - price <= 0.0) {
		return YellowCell;
	}

	return NormalCell;
};

const calcWantedPriceMemoized = memoize(calcWantedPrice);

/**
 * Вспомогательная функция для отображения строки таблицы
 * @param aq
 * @param aqDate
 * @param isEditable
 */
export const calcRowData = (aq: IAсquisitionOfObligation, aqDate: Date, isEditable: boolean, broker: IBroker) => {
	// чтобы не замедлять приложение, считаем wantedPrice только для редактируемой таблицы
	const wantedPrice = isEditable ? calcWantedPriceMemoized(aq, aqDate, 12, broker) : createEmptyPercent(aq.obligation);
	const Cell = getCellComponentForRow(aq.aquisitionPercent, wantedPrice.value, isEditable);

	return {
		Cell,
		wantedPrice,
	};
};
