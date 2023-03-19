// The utils we are using to test the component
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// the component we are going to test right now
import DefaultChartConfigModal from "../Modals/DefaultChartConfigModal";

describe("Testing the modal component", () => {
	beforeEach(() => {
		Object.defineProperty(window, "localStorage", {
			value: {
				setItem: jest.fn(() => null),
			},
			writable: true,
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
		expect(screen.getAllByRole("heading").length === 3).toBeTruthy();
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

		expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
		expect(reloadChartState).toBeTruthy();
		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			"defaultChartSettings",
			'{"type":"glucose","period":"24"}'
		);
	});

	test("test that errors are comming up when not selecting any radio button", async () => {
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
			screen.getByText("Please select a type and a valid time period !")
		).toBeTruthy();

		expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
		expect(reloadChartState).toBeFalsy();
	});

	test("test that errors are comming up when not selecting an insulin type", async () => {
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

		await userEvent.click(screen.getByLabelText("Insulin data"));
		await userEvent.click(screen.getByLabelText("24h"));
		await userEvent.click(screen.getByRole("button"));

		expect(
			screen.getByText("Please select an insulin type !")
		).toBeTruthy();

		expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
		expect(reloadChartState).toBeFalsy();
	});
});