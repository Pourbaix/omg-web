import { useProcessTimeInTargetZone } from "./useProcessTimeInTargetZone";

describe("useProcessTimeInTargetZone", () => {
	test("Test that data types validation works", () => {
		expect(useProcessTimeInTargetZone("abc", 1, [])).toBeFalsy();
		expect(useProcessTimeInTargetZone(40, "abc", [])).toBeFalsy();
		expect(
			useProcessTimeInTargetZone(40, 180, { test: "test" })
		).toBeFalsy();
	});
	test("Test that the validation for the 3rd parameter works", () => {
		// It should contain a 'glucose' property
		expect(
			useProcessTimeInTargetZone(55, 175, [{ test: "test" }])
		).toBeFalsy();
		expect(
			useProcessTimeInTargetZone(55, 175, [{ glucoseData: 50 }])
		).toBeFalsy();
	});
	test("Test that the hook works correctly", () => {
		let test_data = [{ glucose: 100 }, { glucose: 100 }, { glucose: 100 }];
		expect(useProcessTimeInTargetZone(80, 160, test_data)).toStrictEqual({
			valid: 1,
			hyper: 0,
			hypo: 0,
		});

		test_data = [
			{ glucose: 100 },
			{ glucose: 67 },
			{ glucose: 100 },
			{ glucose: 230 },
		];
		expect(useProcessTimeInTargetZone(70, 160, test_data)).toStrictEqual({
			valid: 0.5,
			hyper: 0.25,
			hypo: 0.25,
		});
	});
});
