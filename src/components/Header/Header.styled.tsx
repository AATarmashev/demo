import styled from 'styled-components';
import { Link } from 'react-router-dom';

const height = '50px';

export const Root = styled.div`
	margin-bottom: 30px;
	position: relative;
	height: ${height};
`;

export const ContentRoot = styled.div`
	position: fixed;
	width: 100vw;
	height: ${height};
	display: flex;
	border: 1px solid black;
	background-color: lightgreen;
	z-index: 2;
`;

interface INavLinkProps {
	selected: boolean;
}

export const NavLink = styled(Link)<INavLinkProps>`
	display: block;
	padding: 0 15px;
	line-height: ${height};
	text-align: center;
	color: initial;
	text-decoration: none;
	font-size: 16px;
	border-right: 1px solid black;
	outline: none;
	${({ selected }) => selected && 'font-weight: bold;'};
`;
