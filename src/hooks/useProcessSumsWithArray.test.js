import { useProcessSumsWithArray } from "./useProcessSumsWithArray";

describe("useProcessSumsWithArray", () => {
	test("Test that the hook return 0 when wrong type parameters are entered", () => {
		expect(useProcessSumsWithArray("test")).toBeFalsy();
		expect(useProcessSumsWithArray(1234)).toBeFalsy();
		expect(useProcessSumsWithArray({})).toBeFalsy();
		expect(useProcessSumsWithArray([])).toBeFalsy();
	});
	test("Test that the hook returns the same number of summs than given arrays", () => {
		let test_data = [
			[
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
			],
			[
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
			],
			[
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
			],
		];
		expect(useProcessSumsWithArray(test_data, "CORRECTION").length).toBe(3);
		test_data = [
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
				{
					insulinDescr: '{"bolusAmount":0.3}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
		];

		expect(
			useProcessSumsWithArray(test_data, "AUTO_BASAL_DELIVERY").length
		).toBe(5);
	});
	test("Test if the average processes well", () => {
		let test_data = [
			[
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
			],
			[
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
			],
			[
				{
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.15,"programmedDuration":0,"deliveredFastAmount":0.15,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
				},
			],
		];
		expect(useProcessSumsWithArray(test_data, "CORRECTION")[0]).toBe(0.3);
		expect(useProcessSumsWithArray(test_data, "CORRECTION")[1]).toBe(0.15);
		expect(useProcessSumsWithArray(test_data, "CORRECTION")[2]).toBe(0.15);

		test_data = [
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
				{
					insulinDescr: '{"bolusAmount":0.3}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
				{
					insulinDescr: '{"bolusAmount":0.27}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
				{
					insulinDescr: '{"bolusAmount":0.3}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
				{
					insulinDescr: '{"bolusAmount":0.15}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
			[
				{
					insulinDescr: '{"bolusAmount":0.04}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
				{
					insulinDescr: '{"bolusAmount":0.67}',
					insulinType: "AUTO_BASAL_DELIVERY",
				},
			],
		];

		expect(
			useProcessSumsWithArray(test_data, "AUTO_BASAL_DELIVERY")[0]
		).toBe(0.62);
		expect(
			useProcessSumsWithArray(test_data, "AUTO_BASAL_DELIVERY")[1]
		).toBe(0.35);
		expect(
			useProcessSumsWithArray(test_data, "AUTO_BASAL_DELIVERY")[2]
		).toBe(0.2);
	});
});
