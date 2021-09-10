import { IPercent } from '../../interfaces/IPercent';
import { SumOfMoney } from '../../classes/SumOfMoney';

export interface IConsolidatedTableEntry {
	isin: string;
	name: string;
	nominal: SumOfMoney;
	quantity: number;
	share: IPercent;
}
