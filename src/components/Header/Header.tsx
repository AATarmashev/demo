import React, { FC } from 'react';
import { Root, ContentRoot, NavLink } from './Header.styled';
import { routes } from '../../routes';
import { useLocation } from 'react-router-dom';

export const Header: FC = () => {
	const location = useLocation();

	return (
		<Root>
			<ContentRoot>
				{routes.map(({ path, title }) => (
					<NavLink key={path} selected={location.pathname === path} to={path}>
						{title}
					</NavLink>
				))}
			</ContentRoot>
		</Root>
	);
};
