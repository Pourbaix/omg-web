export const useProcessTimeInTargetZone = (min, max, data) => {
	const numberOfData = data.length;
	if (
		typeof min !== "number" ||
		typeof max !== "number" ||
		typeof data !== "object" ||
		!(data instanceof Array)
	) {
		return 0;
	}
	let validDataCounter = 0;
	let hypoCounter = 0;
	let hyperCounter = 0;

	let invalid = false;
	data.forEach((element) => {
		if (element.glucose) {
			if (element.glucose > max) {
				hyperCounter++;
			} else if (element.glucose < min) {
				hypoCounter++;
			} else {
				validDataCounter++;
			}
		} else {
			invalid = true;
		}
	});

	let validPerc = validDataCounter / numberOfData;
	let hypoPerc = hypoCounter / numberOfData;
	let hyperPerc = hyperCounter / numberOfData;
	return invalid
		? 0
		: {
				valid: validPerc,
				hyper: hyperPerc,
				hypo: hypoPerc,
		  };
};
