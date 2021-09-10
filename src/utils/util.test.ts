import { addDays, differenceInDays } from 'date-fns';
import { differenceInDays2, addDays2 } from './date-time';
import { stringifyDate } from './jsx';

test('Util differenceInDays2', () => {
	const now = Date.now();

	for (let a = 0; a < 300; ++a) {
		const x = new Date(now + Math.floor(1000000000 * Math.random()));
		const y = new Date(now + Math.floor(1000000000 * Math.random()));

		expect(Math.floor(differenceInDays2(x, y))).toBe(differenceInDays(x, y));
	}
});

test('Util addDays2', () => {
	const now = Date.now();

	for (let a = 0; a < 300; ++a) {
		const x = new Date(now + Math.floor(10000000000 * Math.random()));
		const days = Math.floor(10000 * Math.random());

		expect(addDays2(x, days).toString()).toBe(addDays(x, days).toString());
	}
});
