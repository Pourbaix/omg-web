import Meal from "../assets/meal.svg";

export const useCreateDataStructureHomeChart = (obj) => {
	let glucoseData = obj["GlucoseData"];
	let insulinData = obj["InsulinData"];
	let finalArray = [];
	const mealImage = new Image(22, 22);
	// mealImage.src = "https://www.chartjs.org/docs/next/favicon.ico";
	mealImage.src = Meal;

	glucoseData.forEach((element) => {
		let data = {};
		data["glucose"] = element.glucose;

		insulinData
			.filter((x) => {
				return x.datetime == element.datetime;
			})
			.forEach((x) => {
				if (x.insulinType == "AUTO_BASAL_DELIVERY") {
					data["basal"] = JSON.parse(x.insulinDescr)["bolusAmount"];
				} else if (x.insulinType == "CORRECTION") {
					data["correction"] = JSON.parse(x.insulinDescr)[
						"deliveredFastAmount"
					];
				}
				if (x.insulinType == "MEAL") {
					data["meal"] = x.carbInput;
				}
			});
		let pointStyle = "circle";
		let pointRadius = 8;
		if (data["meal"]) {
			pointStyle = mealImage;
			pointRadius = 32;
		}
		data["pointStyle"] = pointStyle;
		data["pointHoverRadius"] = pointRadius;
		finalArray.push({
			datetime: element.datetime,
			data: data,
		});
		finalArray;
	});
	return finalArray;
};
