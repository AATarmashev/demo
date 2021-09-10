import { Obligation } from '../classes/Obligation';
import { IObligation } from '../interfaces/IObligation';
import rawObligations from './obligations.json';

const obligationEntries = Object.entries(rawObligations).map(([key, value]) => [
	key,
	new Obligation(value as IObligation),
]);

export const obligations = Object.fromEntries(obligationEntries) as { [x: string]: Obligation };
