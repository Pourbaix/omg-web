export const useCreateGroupByType = (objList) => {
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
