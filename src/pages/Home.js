import React, { Component, useEffect, useRef, useState } from "react";
import DefaultHomeChart from "../components/Charts/Line/HomeChart";
import DefaultChartConfigModal from "../components/Modals/DefaultChartConfigModal?js";

/**
 * Home page of the web application
 *
 * Here we can access to the home chart and his the control panel
 */
const Home = () => {
	const [modalState, setModalState] = useState(false);

	const [configState, setConfigState] = useState({
		Glucose: true,
		Meal: true,
		Correction: true,
		Basal: true,
	});
	const [period, setPeriod] = useState(24);
	const [startDatetime, setStartDatetime] = useState("");
	const [endDatetime, setEndDatetime] = useState("");

	// This function is important to not show the chart on mobile
	const isOnMobile = () => {
		let mobileNav = false;
		if (
			navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/iPhone/i)
		) {
			mobileNav = true;
		}
		return "ontouchstart" in document.documentElement || mobileNav;
	};

	// Generate types states => Enabled or Disabled
	const generateConfigInfo = () => {
		let content = [];
		for (let element of Object.keys(configState)) {
			content.push(
				<p className="m-1" key={element}>
					{element}:{" "}
					{configState[element] ? (
						<span className="text-success">Enabled</span>
					) : (
						<span className="text-danger">Disabled</span>
					)}
				</p>
			);
		}
		return content;
	};

	// Function used by the HomeCHart component to trigger rerender of the control panel
	const setDates = (params) => {
		setStartDatetime(new Date(params["first"]).toLocaleString());
		setEndDatetime(new Date(params["last"]).toLocaleString());
	};

	// Triggered when loading component, it reads the configuration
	useEffect(() => {
		let config = JSON.parse(
			window.localStorage.getItem("defaultChartSettings")
		);
		if (config) {
			if (config["types"]) {
				setConfigState(config["types"]);
			}
			if (config["period"]) {
				setPeriod(config["period"]);
			}
		}
	}, []);

	return (
		<div className="container-fluid">
			<div
				className="d-flex flex-column align-items-center"
				style={{ position: "relative" }}
			>
				<h1 className="h1 mb-1 text-gray-800 text-center">
					Welcome to OMG Web application !
				</h1>
				{!isOnMobile() ? (
					<>
						<div
							className="d-flex flex-row w-100 justify-content-center align-items-center"
							style={{ gap: "15px" }}
						>
							<div className="d-flex" style={{ width: "75%" }}>
								<DefaultHomeChart setDates={setDates} />
							</div>
							<div className="d-flex flex-column border border-3 rounded p-4">
								<h5 className="text-center">
									Active Configuration:{" "}
								</h5>
								<p className="text-center fw-bold">
									Data for last {period}h
								</p>
								<hr className="sidebar-divider my-0" />
								<div className="mt-1 mb-1">
									{generateConfigInfo()}
								</div>
								<hr className="sidebar-divider my-0" />
								{startDatetime && endDatetime ? (
									<div className="mt-1 mb-1">
										<p className="mb-1">From: </p>
										<p className="m-1 fw-bold">
											{startDatetime}
										</p>
										<p className="mb-1"> To: </p>
										<p className="m-1 fw-bold">
											{endDatetime}
										</p>
									</div>
								) : (
									<p className="text-danger text-center fw-bold mt-4 mb-4">
										No data to display
									</p>
								)}
								<hr className="sidebar-divider my-0" />
								<button
									className="btn btn-primary mt-2 w-auto"
									onClick={() => {
										setModalState(true);
										// console.log(modalState);
									}}
								>
									Configure default Chart
								</button>
							</div>
						</div>
						{modalState ? (
							<DefaultChartConfigModal
								closeModal={() => {
									// console.log("Modal disabled");
									modalState
										? setModalState(false)
										: setModalState(true);
									// console.log(modalState);
								}}
							/>
						) : (
							""
						)}{" "}
					</>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default Home;
