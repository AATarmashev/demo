/**
 * Формат хранения данных в storage
 */
interface IStoredDataEntry {
	arguments: any[];
	result: any;
}

// type MemoizedCallback = (...args: any[]) => T;
/**
 * Для мемоизации результатов сложных вычислений
 * @param callback
 * @param args
 */
export const memoize = <T extends any>(callback: (...args: any[]) => T): ((...args: any[]) => T) => {
	// Массив сохранённых данных
	const storage = [] as IStoredDataEntry[];

	return (...args: any[]): any => {
		const savedResult = storage.find(x => {
			for (let a = 0; a < x.arguments.length; ++a) {
				if (x.arguments[a] !== args[a]) {
					return false;
				}
			}

			return true;
		});

		if (savedResult) {
			return savedResult.result;
		} else {
			const result = callback(...args);

			storage.push({
				arguments: args,
				result,
			});

			return result;
		}
	};
};
