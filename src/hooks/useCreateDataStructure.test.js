import { useCreateDataStructureHomeChart } from "./useCreateDataStructure";

describe("useCreateDataStructure", () => {
	test("if object has not the right type", () => {
		// Should return
		let resultString = useCreateDataStructureHomeChart("abc");
		let resultNumber = useCreateDataStructureHomeChart(15);
		let resultArray = useCreateDataStructureHomeChart([1, 2, 3]);

		expect(resultString).toBeFalsy();
		expect(resultNumber).toBeFalsy();
		expect(resultArray).toBeFalsy();
	});

	test("if object has the right type but not the right properties", () => {
		// Both are wrong properties
		let noGoodProperties = {
			test: "data1",
			test: "data2",
		};
		// Should be InsulinData => Only one of the two properties is wrong
		let oneWrongProperty = {
			GlucoseData: [],
			Insuline: [],
		};
		let result = useCreateDataStructureHomeChart(noGoodProperties);
		expect(result).toBeFalsy();

		result = useCreateDataStructureHomeChart(oneWrongProperty);
		expect(result).toBeFalsy();
	});

	test("Test that the hook returns the right value", () => {
		// Initial data given to the hook
		let param = {
			GlucoseData: [
				{
					datetime: "2023-04-16T12:50:00.000Z",
					glucose: 117,
					id: "id1",
				},
				{
					datetime: "2023-04-16T13:50:00.000Z",
					glucose: 123,
					id: "id2",
				},
				{
					datetime: "2023-04-16T14:50:00.000Z",
					glucose: 132,
					id: "id3",
				},
			],
			InsulinData: [
				{
					carbInput: 0,
					insulinDescr: '{"bolusAmount":0.025}',
					insulinType: "AUTO_BASAL_DELIVERY",
					datetime: "2023-04-16T14:50:00.000Z",
				},
				{
					carbInput: 50,
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":2.25,"programmedDuration":0,"deliveredFastAmount":2.25,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
					insulinType: "MEAL",
					datetime: "2023-04-16T12:50:00.000Z",
				},
				{
					carbInput: 0,
					insulinDescr: '{"bolusAmount":0.05}',
					insulinType: "AUTO_BASAL_DELIVERY",
					datetime: "2023-04-16T12:50:00.000Z",
				},
				{
					carbInput: 0,
					insulinDescr: '{"bolusAmount":0.0125}',
					insulinType: "AUTO_BASAL_DELIVERY",
					datetime: "2023-04-16T13:50:00.000Z",
				},
				{
					carbInput: 0,
					insulinDescr:
						'{"activationType":"AUTOCORRECTION","programmedFastAmount":0.25,"programmedDuration":0,"deliveredFastAmount":0.25,"bolusType":"FAST"}',
					insulinType: "CORRECTION",
					datetime: "2023-04-16T14:50:00.000Z",
				},
			],
		};
		let result = useCreateDataStructureHomeChart(param);
		// console.log(result);

		// test the first element
		// It should have data about: Glucose, an auto basal delivery and a meal bolus
		expect(result[0]["datetime"]).toBe("2023-04-16T12:50:00.000Z");
		expect(result[0]["data"]).toHaveProperty("glucose", 117);
		expect(result[0]["data"]).toHaveProperty("basal", 0.05);
		expect(result[0]["data"]).toHaveProperty("meal");
		// Since it has a meal value pointStyle and pointHoverRaius should be different
		expect(result[0]["data"]).not.toHaveProperty("pointStyle", "circle");
		expect(result[0]["data"]).toHaveProperty("pointHoverRadius", 32);

		// test the second element
		// It should be the same than the first but without meal
		expect(result[1]["datetime"]).toBe("2023-04-16T13:50:00.000Z");
		expect(result[1]["data"]).toHaveProperty("glucose", 123);
		expect(result[1]["data"]).toHaveProperty("basal", 0.0125);
		expect(result[1]["data"]).not.toHaveProperty("meal");
		expect(result[1]["data"]).toHaveProperty("pointStyle", "circle");
		expect(result[1]["data"]).toHaveProperty("pointHoverRadius", 8);

		// test the third component
		// It should be the same than the first but with a correction value
		expect(result[2]["datetime"]).toBe("2023-04-16T14:50:00.000Z");
		expect(result[2]["data"]).toHaveProperty("glucose", 132);
		expect(result[2]["data"]).toHaveProperty("basal", 0.025);
		expect(result[2]["data"]).toHaveProperty("correction");
		expect(result[2]["data"]).not.toHaveProperty("meal");
	});
});
