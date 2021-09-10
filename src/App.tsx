import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { routes } from './routes';
import { Header } from './components/Header/Header';

const indexOfPageForCurrentYear = new Date().getFullYear() - 2020;

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Switch>
				{routes.map(({ component: Component, path, props }) => (
					<Route render={() => <Component {...props} />} key={path} path={path} />
				))}
				<Redirect to={routes[indexOfPageForCurrentYear].path} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
