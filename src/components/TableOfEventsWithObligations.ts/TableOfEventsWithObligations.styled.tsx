import styled from 'styled-components';

const width = 1000;
const numberOfColumns = 6;
const widthOfLastColumn = '120px';

export const Root = styled.div`
	margin-top: 30px;
	margin-left: calc((100vw - ${width}px) / 2);
	width: ${width}px;
	display: grid;
	grid-template-columns: repeat(${numberOfColumns - 1}, auto) ${widthOfLastColumn};
	padding: 1px;
	grid-gap: 1px;
	background-color: black;
`;

const AbstractCell = styled.div`
	height: 30px;
	padding: 4px;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
`;

export const Header = styled(AbstractCell)`
	min-height: 50px;
	background-color: white;
`;

export const MainHeader = styled(Header)`
	grid-column: 1 / 7;
	font-size: 1.5em;
`;

interface ICellProps {
	highlight: 'Сегодня' | 'В прошлом' | 'Предупреждение' | '';
}

export const Cell = styled(AbstractCell)<ICellProps>`
	position: relative;
	min-height: 30px;
	${({ highlight }) => highlight === 'Предупреждение' && 'background-color: lightyellow;'}
	${({ highlight }) => highlight === 'В прошлом' && 'background-color: lightgray;'}
	${({ highlight }) => highlight === 'Сегодня' && 'background-color: lightgreen;'}
`;

interface IMonthCellProps {
	height: number;
}

export const Month = styled.div<IMonthCellProps>`
	position: absolute;
	top: 0;
	left: 0;
	height: ${({ height }) => height}px;
	width: ${widthOfLastColumn};
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	z-index: 1;
`;

export const BrokerIcon = styled.img`
	height: 25px;
`;
