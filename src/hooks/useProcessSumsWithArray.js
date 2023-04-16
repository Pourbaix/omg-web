export const useProcessSumstWithArray = (objList, insulinType) => {
	// console.log(objList);
	let finalArray = [];
	switch (insulinType) {
		case "CORRECTION":
			objList.forEach((element) => {
				let init = 0.0;
				let sum = element.reduce(
					(acc, curr) =>
						acc +
						JSON.parse(curr["insulinDescr"])["deliveredFastAmount"],
					init
				);
				finalArray.push(sum);
			});
			break;
		case "MEAL":
			objList.forEach((element) => {
				let init = 0.0;
				let sum = element.reduce(
					(acc, curr) => acc + curr["carbInput"],
					init
				);
				finalArray.push(sum);
			});
			break;
		case "AUTO_BASAL_DELIVERY":
			objList.forEach((element) => {
				let init = 0.0;
				let sum = element.reduce(
					(acc, curr) =>
						acc + JSON.parse(curr["insulinDescr"])["bolusAmount"],
					init
				);
				finalArray.push(sum);
			});
			break;
	}
	return finalArray;
};
