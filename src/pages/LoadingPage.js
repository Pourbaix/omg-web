import { useEffect, useState } from "react";
import { checkAutoImportConfig, autoImportData } from "../services/omgServer";

import "../styles/scss/pages/loadingPage.scss";
import LoadingConfig from "../assets/loading2.svg";

const LoadingPage = () => {
	const [message, setMessage] = useState("Loading the app...");

	const checkAutoImportConfiguration = async () => {
		const response = await checkAutoImportConfig();
		return response;
	};

	const importLastDataFromAPI = async () => {
		await autoImportData();
		setMessage("Welcome to OMG !");
		setTimeout(() => {
			window.location = window.location.href + "home";
		}, 1000);
	};

	useEffect(() => {
		setMessage("Checking auto-import configuration...");
		setTimeout(() => {
			let config = checkAutoImportConfiguration();
			if (config) {
				setMessage("Importing last 24 hours datas...");
				importLastDataFromAPI();
			} else {
				setMessage("Welcome to OMG !");
				setTimeout(() => {
					window.location = window.location.href + "home";
				}, 1000);
			}
		}, 1500);
	}, []);

	return (
		<div className="main bg-gradient-primary">
			<div className="d-flex flex-row align-items-center ms-4 mt-4">
				<i className="fas fa-chart-area fa-4x text-white mb-1" />
				<div className="h1 text-white fw-bold ms-3 mb-0">OMG Web</div>
			</div>
			<h2>{message}</h2>
			<img src={LoadingConfig} alt="" />
			<p>This should not take much time</p>
		</div>
	);
};

export default LoadingPage;
