export const useProcessAvg = (list, dataToProcess = "") => {
	if (list.length && typeof list == "object" && list instanceof Array) {
		if (dataToProcess) {
			const initial = 0;
			// Le reduce retourne la somme totale des éléments de l'array.
			// Ensuite on divise cette somme par la longueur de la liste
			return (
				list.reduce((a, b) => a + b[dataToProcess], initial) /
				list.length
			);
		} else {
			// Le reduce retourne la somme totale des éléments de l'array.
			// Ensuite on divise cette somme par la longueur de la liste
			return list.reduce((a, b) => a + b) / list.length;
		}
	} else {
		return null;
	}
};
