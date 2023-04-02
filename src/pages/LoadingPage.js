import { useEffect, useRef, useState } from "react";
import { checkAutoImportConfig, autoImportData } from "../services/omgServer";

import "../styles/scss/pages/loadingPage.scss";
import LoadingConfig from "../assets/loading2.svg";
import WarningLogo from "../assets/warning.svg";

const LoadingPage = () => {
	const [message, setMessage] = useState("Loading the app...");
	const container = useRef(null);
	const [imageToDisplay, setImageToDisplay] = useState(LoadingConfig);
	const [waitingMessage, setWaitingMessage] = useState(
		"This should not take much time"
	);

	const checkAutoImportConfiguration = async () => {
		const response = await checkAutoImportConfig();
		return response;
	};

	const importLastDataFromAPI = async () => {
		let response = await autoImportData();
		if (response == "Data imported") {
			setMessage("Welcome to OMG !");
			setTimeout(() => {
				window.location = window.location.href + "home";
			}, 1000);
		} else if ("Could not import data!") {
			setMessage("An error occured while importing data from the API!");
			container.current.style.background = "red";
			setWaitingMessage("Please try again later");
			setImageToDisplay(WarningLogo);
			setTimeout(() => {
				window.location = window.location.href + "home";
			}, 5000);
		}
	};

	useEffect(() => {
		setMessage("Checking auto-import configuration...");
		setTimeout(async () => {
			let config = await checkAutoImportConfiguration();
			if (config) {
				console.log(config);
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
		<div ref={container} className="main bg-gradient-primary">
			<div className="d-flex flex-row align-items-center ms-4 mt-4">
				<i className="fas fa-chart-area fa-4x text-white mb-1" />
				<div className="h1 text-white fw-bold ms-3 mb-0">OMG Web</div>
			</div>
			<h2 style={{ textAlign: "center" }}>{message}</h2>
			<img src={imageToDisplay} alt="Loading the app" />
			<p>{waitingMessage}</p>
		</div>
	);
};

export default LoadingPage;
