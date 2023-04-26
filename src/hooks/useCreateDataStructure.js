import Meal from "../assets/meal.svg";

export const useCreateDataStructureHomeChart = (obj) => {
	// Create a data structure from raw data object to be displayed in the home chart
	if (typeof obj !== "object" || obj instanceof Array) {
		return 0;
	}
	if (obj["GlucoseData"] && obj["InsulinData"]) {
		let glucoseData = obj["GlucoseData"];
		let insulinData = obj["InsulinData"];
		let finalArray = [];
		const mealImage = new Image(22, 22);

		mealImage.src = Meal;

		glucoseData.forEach((element) => {
			let data = {};
			data["glucose"] = element.glucose;

			insulinData
				.filter((x) => {
					return x.datetime == element.datetime;
				})
				.forEach((x) => {
					// MAYBE BREAKING CHANGE:
					// if (x.insulinType == "AUTO_BASAL_DELIVERY") {
					// 	data["basal"] = JSON.parse(x.insulinDescr)["bolusAmount"];
					// } else if (x.insulinType == "CORRECTION") {
					// 	data["correction"] = JSON.parse(x.insulinDescr)[
					// 		"deliveredFastAmount"
					// 	];
					// }
					// if (x.insulinType == "MEAL") {
					// 	data["meal"] = x.carbInput;
					// }
					switch (x.insulinType) {
						case "AUTO_BASAL_DELIVERY":
							data["basal"] = JSON.parse(x.insulinDescr)[
								"bolusAmount"
							];
							break;
						case "CORRECTION":
							data["correction"] = JSON.parse(x.insulinDescr)[
								"deliveredFastAmount"
							];
							break;
						case "MEAL":
							if (typeof x.insulinDescr === "string") {
								data["meal"] = JSON.parse(x.insulinDescr)[
									"deliveredFastAmount"
								];
								break;
							}
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
	} else {
		return 0;
	}
};
