import { IObligation } from '../interfaces/IObligation';
import { ICurrency, Currencies } from '../data/currencies';
import {addDays2, date, differenceInDays2, transferDayOffs, calcNextCouponDate, calcPreviousCouponDate, dateIsBetween, transferDayOff} from '../utils/date-time';
import { SumOfMoney } from './SumOfMoney';
import { IPayment } from '../interfaces/IPayment';

const calcMaturities = (raw: IObligation, lastMaturityDate: Date, nominal: SumOfMoney): IPayment[] => {
	return raw.date.maturities
		? raw.date.maturities.map(x => ({
				date: transferDayOff(date(x.date)),
				value: new SumOfMoney(nominal.getCurrency(), x.value),
		  }))
		: [
				{
					date: transferDayOff(lastMaturityDate),
					value: nominal,
				},
		  ];
};

export class Obligation {
	/**
	 * Валюта
	 */
	private currency: ICurrency;
	/**
	 * Дата погашения
	 */
	private maturity: Date;
	/**
	 * Даты погашений
	 */
	private maturities: IPayment[] = [];
	/**
	 * Оферта
	 */
	private offer: Date | null;
	/**
	 * Любая дата оплаты
	 */
	private payment: Date;
	/**
	 * Первоначальный номинал облигации
	 */
	private nominal: SumOfMoney;

	constructor(private raw: IObligation) {
		const currency = Object.values(Currencies).find(x => x.name === raw.currency);

		if (!currency) {
			throw new Error('Не предусмотренный вид валюты ' + raw.currency);
		}

		this.currency = currency;
		this.maturity = date(raw.date.maturity);
		this.offer = raw.date.offer ? date(raw.date.offer) : null;
		this.payment = date(raw.date.payment);
		this.nominal = new SumOfMoney(currency, raw.nominal);
		this.maturities = calcMaturities(raw, this.maturity, this.nominal);
	}
	/**
	 * Возвращает купонные даты, попавшие в указанный промежуток
	 * @param dateOfStart дата начала включительно
	 * @param dateOfEnd дата конца включительно
	 */
	public getCouponDates(dateOfStart: Date, dateOfEnd: Date): Date[] {
		const period = this.getPeriodBetweenPayments();

		const daysTillStart = differenceInDays2(dateOfStart, this.payment);
		const daysTillEnd = differenceInDays2(dateOfEnd, this.payment);
		const periodsTillStart = Math.floor(daysTillStart / period) - 1;
		const periodsTillEnd = Math.floor(daysTillEnd / period) + 1;
		const deltaDaysTillStart = periodsTillStart * period;
		const deltaDaysTillEnd = periodsTillEnd * period;
		const correctedDateOfEnd = dateOfEnd < this.maturity ? dateOfEnd : this.maturity;

		const result = [];
		for (let a = deltaDaysTillStart; a <= deltaDaysTillEnd; a += period) {
			const currentDate = addDays2(this.payment, a);
			if (dateIsBetween(currentDate, dateOfStart, correctedDateOfEnd)) {
				result.push(currentDate);
			}
		}

		return transferDayOffs(result);
	}

	public getCurrency(): ICurrency {
		return this.currency;
	}

	public getFinalMaturityDate(): Date {
		return this.maturity;
	}

	public getMaturityPayments(): IPayment[] {
		return this.maturities;
	}

	public getOfferDate(): Date | null {
		return this.offer;
	}

	public getPaymentDate(): Date {
		return this.payment;
	}
	/**
	 * Период между платежами в днях
	 */
	public getPeriodBetweenPayments(): number {
		return this.raw.periodBetweenPayments;
	}

	public getName(): string {
		return this.raw.name.inQUIK;
	}
	/**
	 * Возвращает кол-во купонных выплат, приходящихся на указанный промежуток
	 * @param dateOfStart 
	 * @param dateOfEnd 
	 */
	public getNumberOfCouponDates(dateOfStart: Date, dateOfEnd: Date): number {
		return this.getCouponDates(dateOfStart, dateOfEnd).length;
	}

	public getLongName(): string {
		return this.raw.name.inReport;
	}

	public getISIN(): string {
		return this.raw.name.ISIN;
	}

	public getNominal(date: Date): SumOfMoney {
		let valueOfNominal = this.nominal.getValue();

		for (let a = 0; a < this.maturities.length; ++a) {
			const currentMaturity = this.maturities[a];

			if (date.getTime() > currentMaturity.date.getTime()) {
				valueOfNominal -= currentMaturity.value.getValue();
			}
		}

		return new SumOfMoney(this.currency, valueOfNominal);
	}

	public getPercent(): number {
		return this.raw.percent;
	}

	public getPercentAfterOffer(): number | undefined {
		return this.raw.percentAfterOffer;
	}

	public getNextCouponDate(date: Date): Date {
		return calcNextCouponDate(this.getPeriodBetweenPayments(), this.getPaymentDate(), date);
	}

	public getPreviousCouponDate(date: Date): Date {
		return calcPreviousCouponDate(this.getPeriodBetweenPayments(), this.getPaymentDate(), date);
	}
}
