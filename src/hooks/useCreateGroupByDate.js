export const useCreateGroupByDate = (objList) => {
	// Groups elements by date
	let currentDate = "";
	let groupList = [];
	let group = [];
	if (typeof objList == "object" && objList instanceof Array) {
		objList.forEach((element, index, array) => {
			if (currentDate) {
				if (
					currentDate ===
					new Date(element.datetime).toLocaleDateString()
				) {
					group.push(element);
				} else {
					groupList.push(group);
					group = [element];
					currentDate = new Date(
						element.datetime
					).toLocaleDateString();
				}
				index == array.length - 1 ? groupList.push(group) : "";
			} else {
				group.push(element);
				currentDate = new Date(element.datetime).toLocaleDateString();
			}
		});
		return groupList;
	}
	return 0;
};
