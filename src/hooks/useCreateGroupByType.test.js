import { useCreateGroupByType } from "./useCreateGroupByType";

describe("useCreateGroupByType", () => {
	test("Test that type validation works", () => {
		expect(useCreateGroupByType("test")).toBeFalsy();
		expect(useCreateGroupByType(123)).toBeFalsy();
		expect(useCreateGroupByType({})).toBeFalsy();
	});
	test("Test that the hook works correctly", () => {
		let test_data = [
			{ insulinType: "MEAL" },
			{ insulinType: "CORRECTION" },
			{ insulinType: "MEAL" },
			{ insulinType: "AUTO_BASAL_DELIVERY" },
			{ insulinType: "AUTO_BASAL_DELIVERY" },
			{ insulinType: "CORRECTION" },
			{ insulinType: "AUTO_BASAL_DELIVERY" },
		];
		expect(useCreateGroupByType(test_data).length).toBe(3);
		expect(useCreateGroupByType(test_data)[0].length).toBe(2);
		expect(useCreateGroupByType(test_data)[1].length).toBe(2);
		expect(useCreateGroupByType(test_data)[2].length).toBe(3);
	});
});
