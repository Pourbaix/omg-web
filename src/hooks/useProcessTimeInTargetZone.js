export const useProcessTimeInTargetZone = (min, max, data) => {
	const numberOfData = data.length;

	let validDataCounter = 0;
	let hypoCounter = 0;
	let hyperCounter = 0;
	data.forEach((element) => {
		if (element.glucose > max) {
			hyperCounter++;
		} else if (element.glucose < min) {
			hypoCounter++;
		} else {
			validDataCounter++;
		}
	});

	let validPerc = validDataCounter / numberOfData;
	let hypoPerc = hypoCounter / numberOfData;
	let hyperPerc = hyperCounter / numberOfData;

	return {
		valid: validPerc,
		hyper: hyperPerc,
		hypo: hypoPerc,
	};
};
