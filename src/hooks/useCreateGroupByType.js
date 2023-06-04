export const useCreateGroupByType = (objList) => {
	// Groups elements by type => MEAL, CORRECTION or BASAL
	if (typeof objList !== "object" || !(objList instanceof Array)) {
		return 0;
	}
	let correction = [];
	let meal = [];
	let basal = [];
	objList.forEach((element) => {
		switch (element.insulinType) {
			case "CORRECTION":
				correction.push(element);
				break;
			case "MEAL":
				meal.push(element);
				break;
			case "AUTO_BASAL_DELIVERY":
				basal.push(element);
				break;
		}
	});
	return [correction, meal, basal];
};
