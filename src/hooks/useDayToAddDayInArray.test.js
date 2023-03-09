import { renderHook } from "@testing-library/react";
import { useDayToAddDayInArray } from "./useDayToAddDayInArray";

describe("useDayToAddDayInArray", () => {
	test("add sunday (1) into empty array of selected days", () => {
		const { result } = renderHook(() => useDayToAddDayInArray(1, []));
		// console.log(result.current);
		const exactResult = [1];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("add saturday (64) into empty array of selected days", () => {
		const { result } = renderHook(() => useDayToAddDayInArray(64, []));
		// console.log(result.current);
		const exactResult = [64];
		expect(result.current).toStrictEqual(exactResult);
	});
	test("add saturday (64) into array already containing sunday (1)", () => {
		const { result } = renderHook(() => useDayToAddDayInArray(64, [1]));
		const exactResult = [1, 64];
		expect(result.current).toStrictEqual(exactResult);
	});
});
