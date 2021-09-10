import { IMassiveAсquisitionOfObligations } from '../interfaces/IMassiveAсquisitionOfObligations';
import { obligations } from './obligations';
import { date } from '../utils/date-time';
import { Brokers } from './brokers';
/**
 * Список приобретений
 */
export const massiveAquisitions = [
	{
		aquisitions: [
			{
				aquisitionPercent: 100.94,
				obligation: obligations['Облигация1'],
				quantity: 5,
			},
			{
				aquisitionPercent: 100.65,
				obligation: obligations['Компания 1'],
				quantity: 10,
			},
			{
				aquisitionPercent: 104.15,
				obligation: obligations['Компания 2'],
				quantity: 10,
			},
			{
				aquisitionPercent: 103.98,
				obligation: obligations['Компания 3'],
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('11.9.2020'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.7,
				obligation: obligations['Компания 4'],
				quantity: 15,
			},
			{
				aquisitionPercent: 102.0,
				obligation: obligations['Облигация1'],
				quantity: 5,
			},
			{
				aquisitionPercent: 102.29,
				obligation: obligations['Облигация1'],
				quantity: 1,
			},
			{
				aquisitionPercent: 102.26,
				obligation: obligations['Облигация1'],
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('18.11.2020'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.43,
				obligation: obligations['Компания 3'],
				quantity: 5,
			},
			{
				aquisitionPercent: 103.59,
				obligation: obligations['Компания 5'],
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('29.12.2020'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 106.0,
				obligation: obligations['Компания 4'],
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('16.01.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.8,
				obligation: obligations['Компания 3'],
				quantity: 5,
			},
			{
				aquisitionPercent: 105.6,
				obligation: obligations['Компания 4'],
				quantity: 30,
			},
		],
		broker: Brokers.broker2,
		date: date('6.01.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.89,
				obligation: obligations.Облигация1,
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('20.03.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.18,
				obligation: obligations.Облигация1,
				quantity: 1,
			},
			{
				aquisitionPercent: 103.19,
				obligation: obligations.Облигация1,
				quantity: 15,
			},
			{
				aquisitionPercent: 103.39,
				obligation: obligations['Компания 3'],
				quantity: 20,
			},
			{
				aquisitionPercent: 103.22,
				obligation: obligations['Компания 5'],
				quantity: 20,
			},
			{
				aquisitionPercent: 106.06,
				obligation: obligations.Облигация2,
				quantity: 15,
			},
			{
				aquisitionPercent: 106.34,
				obligation: obligations.Облигация2,
				quantity: 5,
			},
			{
				aquisitionPercent: 106.35,
				obligation: obligations.Облигация2,
				quantity: 35,
			},
		],
		broker: Brokers.broker1,
		date: date('1.03.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.15,
				obligation: obligations.Облигация3,
				quantity: 20,
			},
		],
		broker: Brokers.broker2,
		date: date('4.03.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.8,
				obligation: obligations['Компания 5'],
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('16.03.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.4,
				obligation: obligations.Облигация4,
				quantity: 17,
			},
			{
				aquisitionPercent: 105.41,
				obligation: obligations.Облигация4,
				quantity: 20,
			},
			{
				aquisitionPercent: 105.42,
				obligation: obligations.Облигация4,
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('17.04.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.47,
				obligation: obligations.Облигация3,
				quantity: 1,
			},
		],
		broker: Brokers.broker2,
		date: date('19.04.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.0,
				obligation: obligations.Облигация4,
				quantity: 5,
			},
		],
		broker: Brokers.broker1,
		date: date('5.05.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.68,
				obligation: obligations.Облигация3,
				quantity: 10,
			},
		],
		broker: Brokers.broker2,
		date: date('1.05.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.64,
				obligation: obligations.Облигация3,
				quantity: 10,
			},
		],
		broker: Brokers.broker2,
		date: date('4.06.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 104.98,
				obligation: obligations.Облигация3,
				quantity: 10,
			},
		],
		broker: Brokers.broker2,
		date: date('3.06.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 104.07,
				obligation: obligations.Облигация4,
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('7.06.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.54,
				obligation: obligations['Компания 5'],
				quantity: 5,
			},
		],
		broker: Brokers.broker2,
		date: date('16.07.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 105.3,
				obligation: obligations.Облигация2,
				quantity: 10,
			},
		],
		broker: Brokers.broker1,
		date: date('9.07.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.49,
				obligation: obligations.Облигация1,
				quantity: 10,
			},
		],
		broker: Brokers.broker2,
		date: date('19.08.2021'),
	},
	{
		aquisitions: [
			{
				aquisitionPercent: 103.87,
				obligation: obligations.Облигация3,
				quantity: 5,
			},
			{
				aquisitionPercent: 103.96,
				obligation: obligations.Облигация3,
				quantity: 10,
			},
		],
		broker: Brokers.broker2,
		date: date('13.09.2021'),
	},
] as IMassiveAсquisitionOfObligations[];
