import { ICurrency } from '../data/currencies';
import { IPercent } from '../interfaces/IPercent';
import { moneyValue } from '../utils/common';

/**
 * Денежная сумма
 */
export class SumOfMoney {
	/**
	 * Складывает суммы в массиве, с учётом того, что нельзя складывать разные валюты
	 * @param array
	 */
	public static reduceArray(array: SumOfMoney[]): SumOfMoney[] {
		const result = array.slice();

		for (let a = 0; ; ++a) {
			if (a >= result.length - 1) {
				break;
			}

			for (let b = a + 1; ; ++b) {
				if (b >= result.length) {
					break;
				}

				const firstSum = result[a];
				const secondSum = result[b];

				if (firstSum.getCurrency() === secondSum.getCurrency()) {
					result[a] = firstSum.add(secondSum);

					result[b] = result[result.length - 1];
					result.pop();
					b--;
				}
			}
		}

		return result;
	}

	constructor(private currency: ICurrency, private value: number, private _isEmpty?: true) {}

	public addNumber(term: number): SumOfMoney {
		return new SumOfMoney(this.currency, moneyValue(this.value + term), this._isEmpty);
	}

	public add(anotherSum: SumOfMoney): SumOfMoney {
		return this.addNumber(anotherSum.getValue());
	}
	/**
	 * Возвращает ту же сумму, удаляя пометку о том, что она пустая
	 */
	public asNotEmpty(): SumOfMoney {
		return new SumOfMoney(this.currency, this.value);
	}

	public asPercent(): IPercent {
		return {
			currency: this.currency,
			isEmpty: this._isEmpty,
			value: this.value,
		};
	}
	/**
	 * Возвращает пустую сумму в той же валюте
	 */
	public empty(): SumOfMoney {
		return new SumOfMoney(this.currency, 0, true);
	}

	public getCurrency(): ICurrency {
		return this.currency;
	}

	public getValue(): number {
		return this.value;
	}

	public isEmpty(): boolean {
		return !!this._isEmpty;
	}

	public multiply(k: number): SumOfMoney {
		return new SumOfMoney(this.currency, moneyValue(this.value * k), this._isEmpty);
	}
}
