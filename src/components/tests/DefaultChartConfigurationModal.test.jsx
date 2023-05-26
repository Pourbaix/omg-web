// The utils we are using to test the component
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// the component we are going to test right now
import DefaultChartConfigModal from "../Modals/DefaultChartConfigModal";

describe("Testing the modal component", () => {
	beforeEach(() => {
		// This is used to register calls to localStorage methods
		Object.defineProperty(window, "localStorage", {
			value: {
				setItem: jest.fn(() => null),
				getItem: jest.fn(() => null),
			},
			writable: true,
		});
		Object.defineProperty(window, "location", {
			value: {
				reload: jest.fn(() => null),
			},
		});
	});

	afterEach(cleanup);
	test("test that the modal loads correctly", async () => {
		let modalState = true;
		let reloadChartState = false;
		const reloadChart = () => {
			reloadChartState = true;
		};

		const setModalState = (value) => {
			modalState = value;
		};

		render(
			<DefaultChartConfigModal
				closeModal={() => {
					modalState ? setModalState(false) : setModalState(true);
				}}
				reloadChart={() => {
					reloadChart();
				}}
			/>
		);
		expect(screen.getAllByRole("heading")[0]).toHaveTextContent(
			"Welcome to the default chart configuration!"
		);
		expect(screen.getAllByRole("heading").length === 4).toBeTruthy();
	});

	test("test that the modal closes correctly", async () => {
		let modalState = true;
		let reloadChartState = false;
		const reloadChart = () => {
			reloadChartState = true;
		};

		const setModalState = (value) => {
			modalState = value;
		};

		render(
			<DefaultChartConfigModal
				closeModal={() => {
					modalState ? setModalState(false) : setModalState(true);
				}}
				reloadChart={() => {
					reloadChart();
				}}
			/>
		);

		await userEvent.click(screen.getByText("X"));

		expect(modalState).toBeFalsy();
	});

	test("test that the config is correctly stored in the localstorage", async () => {
		let modalState = true;
		let reloadChartState = false;
		const reloadChart = () => {
			reloadChartState = true;
		};

		const setModalState = (value) => {
			modalState = value;
		};

		render(
			<DefaultChartConfigModal
				closeModal={() => {
					modalState ? setModalState(false) : setModalState(true);
				}}
				reloadChart={() => {
					reloadChart();
				}}
			/>
		);

		await userEvent.click(screen.getByLabelText("Glucose data"));
		await userEvent.click(screen.getByLabelText("24h"));
		await userEvent.click(screen.getByRole("button"));
		await userEvent.click(screen.getByLabelText("Display Tags?"));

		expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
		// expect(reloadChartState).toBeTruthy();
		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			"defaultChartSettings",
			'{"types":{"glucose":true,"basal":false,"meal":false,"correction":false},"period":"24","displayTags":false}'
		);
	});

	test("test that errors are comming up when not selecting any checkbox button", async () => {
		let modalState = true;
		let reloadChartState = false;
		const reloadChart = () => {
			reloadChartState = true;
		};

		const setModalState = (value) => {
			modalState = value;
		};

		render(
			<DefaultChartConfigModal
				closeModal={() => {
					modalState ? setModalState(false) : setModalState(true);
				}}
				reloadChart={() => {
					reloadChart();
				}}
			/>
		);

		await userEvent.click(screen.getByRole("button"));

		expect(
			screen.getByText(
				"Please select at least one type and a valid time period !"
			)
		).toBeTruthy();

		expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
		expect(reloadChartState).toBeFalsy();
	});

	test("test that errors are comming up when not selecting a period", async () => {
		let modalState = true;
		let reloadChartState = false;
		const reloadChart = () => {
			reloadChartState = true;
		};

		const setModalState = (value) => {
			modalState = value;
		};

		render(
			<DefaultChartConfigModal
				closeModal={() => {
					modalState ? setModalState(false) : setModalState(true);
				}}
				reloadChart={() => {
					reloadChart();
				}}
			/>
		);

		await userEvent.click(screen.getByLabelText("Basal Insulin"));
		await userEvent.click(screen.getByRole("button"));

		expect(
			screen.getByText(
				"Please select at least one type and a valid time period !"
			)
		).toBeTruthy();

		expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
		expect(reloadChartState).toBeFalsy();
	});
});
