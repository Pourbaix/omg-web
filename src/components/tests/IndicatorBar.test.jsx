// The utils we are using to test the component
import { cleanup, render, screen, prettyDOM } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import IndicatorBar from "../StatsComponents/IndicatorBar";
import "../../styles/scss/stats/indicatorBar.scss";

describe("Testing the IndicatorBar component", () => {
	afterEach(cleanup);
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
		// let actualPos = 90.0;
		// render(<IndicatorBar min={min} max={max} actualPosition={actualPos} />);
		// let indicator = await screen.findByText(actualPos);
		// console.log(window.getComputedStyle(indicator));
		// console.log(prettyDOM(document));
	});
	test("test that the color of the indicator changes correctly", () => {});
});
