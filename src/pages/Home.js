import React, { Component, useEffect, useRef, useState } from "react";
import DefaultHomeChart from "../components/Charts/Line/HomeChart";
import DefaultChartConfigModal from "../components/Modals/DefaultChartConfigModal?js";

/**
 * Home page of the web application
 */
const Home = () => {
	const [modalState, setModalState] = useState(false);
	const [reloadSeed, setReloadSeed] = useState(0);

	const [configState, setConfigState] = useState({
		Glucose: true,
		Meal: true,
		Correction: true,
		Basal: true,
	});
	const [period, setPeriod] = useState(24);
	const [startDatetime, setStartDatetime] = useState("");
	const [endDatetime, setEndDatetime] = useState("");

	const reloadChart = () => {
		// console.log("Reload");
		setReloadSeed(Math.random());
		// console.log(reloadSeed);
	};

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

	const setDates = (params) => {
		// console.log(params);
		setStartDatetime(new Date(params["first"]).toLocaleString());
		setEndDatetime(new Date(params["last"]).toLocaleString());
	};

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
	}, [reloadSeed]);

	return (
		<div className="container-fluid">
			<div
				className="d-flex flex-column align-items-center"
				style={{ position: "relative" }}
			>
				<h1 className="h1 mb-2 text-gray-800">
					Welcome to OMG Web application !
				</h1>
				<div
					className="d-flex flex-row w-100 justify-content-center align-items-center"
					style={{ gap: "15px" }}
				>
					<div className="d-flex" style={{ width: "75%" }}>
						{/* <DefaultHomeChart reloadProps={reloadSeed} /> */}
						<DefaultHomeChart
							reloadProps={reloadSeed}
							setDates={setDates}
						/>
					</div>
					<div className="d-flex flex-column border border-3 rounded p-4">
						<h5 className="text-center">Active Configuration: </h5>
						<p className="text-center fw-bold">
							Data for last {period}h
						</p>
						<hr className="sidebar-divider my-0" />
						<div className="mt-1 mb-1">{generateConfigInfo()}</div>
						<hr className="sidebar-divider my-0" />
						{startDatetime && endDatetime ? (
							<div className="mt-1 mb-1">
								<p className="mb-1">From: </p>
								<p className="m-1 fw-bold">{startDatetime}</p>
								<p className="mb-1"> To: </p>
								<p className="m-1 fw-bold">{endDatetime}</p>
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
						reloadChart={() => {
							reloadChart();
						}}
					/>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default Home;
