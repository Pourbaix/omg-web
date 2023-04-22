export const useRemoveTodayData = (array) => {
	if (typeof array !== "object" || !(array instanceof Array)) {
		return 0;
	}

	let startOfDay = new Date();
	startOfDay.setHours(0);
	startOfDay.setMinutes(0);
	startOfDay.getSeconds(0);
	startOfDay.setMilliseconds(0);

	let newArray = array.filter((element) => {
		if (new Date(element.datetime) < startOfDay) {
			return element;
		}
	});
	return newArray;
};
