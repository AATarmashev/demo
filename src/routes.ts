import { FC } from 'react';
import { AquisitionsPage } from './pages/AquisitionsPage';
import { EstimationPage } from './pages/EstimationPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ConsolidatedPage } from './pages/ConsolidatedPage';
import { Brokers } from './data/brokers';

interface IRouteEntry {
	component: FC;
	path: string;
	props?: any;
	title: string;
}
/**
 * Страницы приобретений, каждая на свой год
 */
const aquisitionPages = Array.from({ length: new Date().getFullYear() - 2019 }, (x, index) => 2020 + index).map(
	year =>
		({
			component: AquisitionsPage,
			path: `/aquisitions/${year}`,
			title: `Приобретения ${year}`,
		} as IRouteEntry)
);
/**
 * Страницы оценок, каждая для своего брокера
 */
const estimationPages = Object.values(Brokers).map(
	broker =>
		({
			component: EstimationPage,
			path: `/estimations/${broker.shortName}`,
			props: { broker },
			title: `Оценка: ${broker.name}`,
		} as IRouteEntry)
);

export const routes = [
	...aquisitionPages,
	{
		component: ConsolidatedPage,
		path: '/consolidated',
		title: 'Сводные данные',
	},
	{
		component: PaymentsPage,
		path: '/payments',
		title: 'Каледарь выплат',
	},
	...estimationPages,
] as IRouteEntry[];
