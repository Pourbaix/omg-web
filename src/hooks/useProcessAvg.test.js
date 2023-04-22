import { useProcessAvg } from "./useProcessAvg";

describe("useProcessAvg", () => {
	test("Test that it returns null when the list is empty or the type is wrong", () => {
		expect(useProcessAvg([])).toBe(null);
		expect(useProcessAvg("hello")).toBe(null);
		expect(useProcessAvg(1234)).toBe(null);
		expect(useProcessAvg({})).toBe(null);
	});
	test("test that the hook works correctly with a given dataToProcess attribute", () => {
		let data1 = [{ value: 5 }, { value: 5 }, { value: 7 }, { value: 3 }];
		let data2 = [{ value: 3 }, { value: 3 }, { value: 3 }, { value: 3 }];
		let data3 = [
			{ value: -3, uselessValue: "hello" },
			{ value: 3 },
			{ value: 6, anotherUselessValue: "yes" },
			{ value: 14 },
		];

		// Simple check of the average
		expect(useProcessAvg(data1, "value")).toBe(5);
		// all the same value should return the same value for average
		expect(useProcessAvg(data2, "value")).toBe(3);
		// We just pick the given value
		expect(useProcessAvg(data3, "value")).toBe(5);
	});
	test("test that the hook works correctly with no given dataToProcess attribute", () => {
		let data1 = [1, 1, 1, 1, 1];
		let data2 = [3, 6, 4, 3];

		expect(useProcessAvg(data1)).toBe(1);
		expect(useProcessAvg(data2)).toBe(4);
	});
});
