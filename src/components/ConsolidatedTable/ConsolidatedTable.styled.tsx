import styled from 'styled-components';

export const Root = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const TableRoot = styled.div`
	width: 1000px;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-gap: 1px;
	padding: 1px;
	background-color: black;
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

export const HeaderCell = styled(Cell)`
	white-space: normal;
`;
