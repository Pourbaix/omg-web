import { renderHook } from "@testing-library/react";
import { useFormatStringForId } from "./useFormatStringForId";

describe("useFormatStringForId", () => {
	test("space removed", () => {
		const { result } = renderHook(() => useFormatStringForId("aa zz"));
		// console.log(result.current);
		expect(result.current).toBe("aazz");
	});
	test("accent removed", () => {
		const { result } = renderHook(() => useFormatStringForId("goûter"));
		expect(result.current).toBe("goter");
	});
	test("allowed char still there", () => {
		const { result } = renderHook(() =>
			useFormatStringForId("ta_rte-pom:me.")
		);
		expect(result.current).toBe("tartepomme");
	});
});
