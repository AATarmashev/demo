import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

const calcProfits = (months: number, startingSum: number, sumPerMonth: number, inflationPerMonth: number): number[] => {
	const result = [] as number[];

	let sum = startingSum;
	let cummulativeInflation = 1.0;
	for (let a = 0; a < months; ++a) {
		sum = Math.floor(1.01 * sum);
		sum = Math.floor(sum / inflationPerMonth + sumPerMonth / cummulativeInflation / (1.0 + 0.1));

		result.push(sum);

		cummulativeInflation *= inflationPerMonth;
	}

	return result;
};

// 1.00565414% в месяц = 7% в год

console.log(calcProfits(11, 168550, 76000, 1.00565414));
