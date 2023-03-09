import { renderHook } from "@testing-library/react";
import { useNumberToArrayDayNameNumber } from "./useNumberToArrayDayNameNumber";

describe("useNumberToArrayDayNameNumber", () => {
	test("0 return []", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(0));
		// console.log(result.current);
		const exactResult = [];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("1 return [0]", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(1));
		const exactResult = [0];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("2 return [1]", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(2));
		// console.log(result.current);
		const exactResult = [1];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("3 return [0, 1]", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(3));
		// console.log(result.current);
		const exactResult = [0, 1];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("127 return [0, 1, 2, 3, 4, 5, 6]", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(127));
		const exactResult = [0, 1, 2, 3, 4, 5, 6];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("126 return [1, 2, 3, 4, 5, 6]", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(126));
		// console.log(result.current);
		const exactResult = [1, 2, 3, 4, 5, 6];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("125 return [0, 2, 3, 4, 5, 6]", () => {
		const { result } = renderHook(() => useNumberToArrayDayNameNumber(125));
		// console.log(result.current);
		const exactResult = [0, 2, 3, 4, 5, 6];
		expect(result.current).toStrictEqual(exactResult);
	});
});
