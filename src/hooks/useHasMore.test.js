import { renderHook } from "@testing-library/react";
import { useHasMore } from "./useHasMore";

describe("useHasMore", () => {
	test("add sunday (1) into empty array of selected days", () => {
		const { result } = renderHook(() => useHasMore(3, [{}]));
		// console.log(result.current);
		const exactResult = true;
		expect(result.current).toBe(exactResult);
	});
	test("add sunday (1) into empty array of selected days", () => {
		const { result } = renderHook(() =>
			useHasMore(1, [{ tag: "test", tagdate: "test" }])
		);
		// console.log(result.current);
		const exactResult = false;
		expect(result.current).toBe(exactResult);
	});
});
