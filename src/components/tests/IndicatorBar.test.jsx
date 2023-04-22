// The utils we are using to test the component
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import IndicatorBar from "../StatsComponents/IndicatorBar";

describe("Testing the IndicatorBar component", () => {
	afterEach(cleanup);
	test("no crash", () => {
		expect(true).toBeTruthy();
	});
	test("test that the components renders correctly", async () => {
		let max = 150;
		let min = 60;
		let actualPos = 70;

		render(<IndicatorBar min={min} max={max} actualPosition={actualPos} />);

		expect(screen.getAllByRole("generic").length).toBe(11);
		expect(screen.findAllByText(max)).toBeTruthy();
		expect(screen.findAllByText(min)).toBeTruthy();
		expect(screen.findAllByText(actualPos)).toBeTruthy();
	});

	test("test that the indicator is at the right place", async () => {
		// let max = 140;
		// let min = 40;
		// let actualPos = 90;
		// render(<IndicatorBar min={min} max={max} actualPosition={actualPos} />);
		// console.log(await screen.findByText(actualPos));
		// console.log(
		// 	document.getElementsByClassName("actual_position_indicator")
		// );
		// expect(screen.findByText(actualPos)).toHaveStyle("left");
	});
	test("test that the color of the indicator changes correctly", () => {});
});
