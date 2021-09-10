import styled from 'styled-components';
import { Cell as UncoloredCell } from './TableOfObligations.styled';

const numberOfColumns = 32;

const subheaders = {
	name: {
		start: 1,
		end: 4,
	},
	price: {
		start: 5,
		end: 12,
	},
	dates: {
		start: 13,
		end: 18,
	},
	payments: {
		start: 18,
		end: 23,
	},
	analytics: {
		start: 23,
		end: numberOfColumns + 1,
	},
};

export const Root = styled.div`
	margin: 25px 0;
`;

interface ITableRootProps {
	color: string;
}

export const TableRoot = styled.div<ITableRootProps>`
	width: 240vw;
	display: grid;
	grid-template-columns: repeat(${numberOfColumns}, auto);
	padding: 1px;
	background-color: black;
	grid-gap: 1px;

	& div {
		background-color: ${({ color }) => color};
	}
`;

export const Cell = styled.div`
	min-height: 50px;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8px;
	text-align: center;
	white-space: nowrap;
`;

export const Header = styled(Cell)`
	white-space: normal;
`;

export const Header1Date = styled(Header)`
	grid-column-start: 1;
	grid-column-end: ${numberOfColumns + 1};
	font-size: 2em;
`;

export const Header2Name = styled(Header)`
	grid-column-start: ${subheaders.name.start};
	grid-column-end: ${subheaders.name.end};
	font-size: 1.5em;
`;

export const Header2Price = styled(Header)`
	grid-column-start: ${subheaders.price.start};
	grid-column-end: ${subheaders.price.end};
	font-size: 1.5em;
`;

export const Header2Dates = styled(Header)`
	grid-column-start: ${subheaders.dates.start};
	grid-column-end: ${subheaders.dates.end};
	font-size: 1.5em;
`;

export const Header2Payments = styled(Header)`
	grid-column-start: ${subheaders.payments.start};
	grid-column-end: ${subheaders.payments.end};
	font-size: 1.5em;
`;

export const Header2Analytics = styled(Header)`
	grid-column-start: ${subheaders.analytics.start};
	grid-column-end: ${subheaders.analytics.end};
	font-size: 1.5em;
`;

export const Input = styled.input`
	height: 40px;
	font-size: 16px;
`;

export const NormalCell = styled(UncoloredCell)`
	background-color: white !important;
`;

export const YellowCell = styled(UncoloredCell)`
	background-color: lightyellow !important;
`;

export const OrangeCell = styled(UncoloredCell)`
	background-color: #ffecd5 !important;
`;

export const BrokerIcon = styled.img`
	margin-right: 10px;
	width: 36px;
	height: 36px;
`;