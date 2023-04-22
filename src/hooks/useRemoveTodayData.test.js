import { useRemoveTodayData } from "./useRemoveTodayData";

describe("useRemoveTodayData", () => {
	test("Test that type validation works", () => {
		expect(useRemoveTodayData("test")).toBeFalsy();
		expect(useRemoveTodayData(123)).toBeFalsy();
		expect(useRemoveTodayData({})).toBeFalsy();
		expect(useRemoveTodayData([])).toBeTruthy();
	});
	test("Test that the hook works correctly", () => {
		let data = [
			{ datetime: "2011-10-05T14:48:00.000Z" },
			{ datetime: "2015-03-09T18:18:00.000Z" },
			{ datetime: new Date().toISOString() },
		];
		expect(useRemoveTodayData(data).length).toBe(2);
		expect(useRemoveTodayData(data)).toStrictEqual([
			{ datetime: "2011-10-05T14:48:00.000Z" },
			{ datetime: "2015-03-09T18:18:00.000Z" },
		]);
	});
});
