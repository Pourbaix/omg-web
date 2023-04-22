import { response } from "express";
import { useCreateGroupByDate } from "./useCreateGroupByDate";
import { element } from "prop-types";

describe("useCreateGroupByDate", () => {
	test("The hook should return 0 if parameter is of wrong type", () => {
		expect(useCreateGroupByDate(0)).toBeFalsy();
		expect(useCreateGroupByDate("a15dc")).toBeFalsy();
		expect(useCreateGroupByDate({ test: "test" })).toBeFalsy();
	});
	test("See if the array returned by the hook is correct", () => {
		// First test set of data
		let input1 = [
			{ datetime: "2023-04-16T14:50:00.000Z", value: "rand45188" },
			{ datetime: "2023-04-16T14:50:00.000Z", value: "rand84961" },
			{ datetime: "2023-04-15T08:35:00.000Z", value: "rand78962" },
			{ datetime: "2023-04-15T08:35:00.000Z", value: "rand89461" },
			{ datetime: "2023-04-16T14:50:00.001Z", value: "rand11111" },
			{ datetime: "2022-04-16T14:50:00.000Z", value: "rand22222" },
		];
		let response1 = useCreateGroupByDate(input1);

		// It should contain 4 groups
		expect(response1).toHaveLength(4);
		expect(response1).toBeTruthy();
		expect(response1[0].map((element) => element.value)).toContain(
			"rand45188"
		);
		expect(response1[0].map((element) => element.value)).toContain(
			"rand84961"
		);
		expect(response1[0].map((element) => element.value)).not.toContain(
			"rand89461"
		);
		expect(response1[0]).toHaveLength(2);

		// Second test set of data
		let input2 = [
			{ datetime: "2023-04-16T14:50:00.000Z", value: "test1" },
			{ datetime: "2023-04-16T14:50:00.000Z", value: "test2" },
			{ datetime: "2023-04-16T14:50:00.000Z", value: "test3" },
		];

		let response2 = useCreateGroupByDate(input2);

		expect(response2).toHaveLength(1);
		expect(response2).toBeTruthy();
		expect(response2[0].map((element) => element.value)).toContain("test1");
		expect(response2[0].map((element) => element.value)).toContain("test2");
		expect(response2[0].map((element) => element.value)).toContain("test3");
		expect(response2[0]).toHaveLength(3);
	});
});
