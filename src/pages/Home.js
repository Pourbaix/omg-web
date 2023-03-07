import React, { Component, useEffect, useRef, useState } from "react";
import DefaultHomeChart from "../components/Charts/Line/HomeChart";
import DefaultChartConfigModal from "../components/Modals/DefaultChartConfigModal?js";

/**
 * Home page of the web application
 */
const Home = () => {
	const [modalState, setModalState] = useState(false);
	const [reloadSeed, setReloadSeed] = useState(0);

	const reloadChart = () => {
		console.log("Reload");
		setReloadSeed(Math.random());
		console.log(reloadSeed);
	};

	console.log("home");
	return (
		<div className="container-fluid">
			<div
				className="d-flex flex-column align-items-center"
				style={{ position: "relative" }}
			>
				<h1 className="h1 mb-2 text-gray-800">
					Welcome to OMG Web application !
				</h1>
				<DefaultHomeChart reloadProps={reloadSeed} />
				{modalState ? (
					<DefaultChartConfigModal
						closeModal={() => {
							console.log("Modal disabled");
							modalState
								? setModalState(false)
								: setModalState(true);
							console.log(modalState);
						}}
						reloadChart={() => {
							reloadChart();
						}}
					/>
				) : (
					""
				)}
				<button
					className="btn btn-primary mt-2"
					onClick={() => {
						setModalState(true);
						console.log(modalState);
					}}
				>
					Configure default Chart
				</button>
			</div>
		</div>
	);
};

export default Home;
