import "../../styles/scss/modals/defaultChartConfigModal.scss";
import { useState, useRef, useEffect } from "react";
import Save from "../../assets/save.svg";
import Checked from "../../assets/checked.svg";

const DefaultChartConfigModal = (props) => {
	const [type, setType] = useState({
		glucose: false,
		basal: false,
		meal: false,
		correction: false,
	});
	const [timePeriod, setTimePeriod] = useState(0);
	const [buttonState, setButtonState] = useState(0);
	const [error, setError] = useState("");
	const [displayTags, setDisplayTags] = useState(false);

	// Refs for the data types
	const glucoseCheckbox = useRef(null);
	const mealCheckbox = useRef(null);
	const basalCheckbox = useRef(null);
	const correctionCheckbox = useRef(null);

	// Refs for the time set
	const firstRadio = useRef(null);
	const secondRadio = useRef(null);
	const thirdRadio = useRef(null);
	const extraRadio = useRef(null);
	const otherPeriod = useRef(null);

	// Refs for the tags
	const displayTagsCheckbox = useRef(false);

	const errorArea = useRef("");

	const handleChangeValue = (element) => {
		let actualConfig = type;
		actualConfig[element.name] = element.checked;
		setType((type) => ({
			...type,
			...actualConfig,
		}));
	};

	const checkTypes = () => {
		for (let element in type) {
			if (type[element]) {
				return true;
			}
		}
		return false;
	};

	const handleSubmit = () => {
		setError("");
		let selectedPeriod = timePeriod;
		if (!checkTypes() || !timePeriod) {
			setError(
				"Please select at least one type and a valid time period !"
			);
			return 0;
		}
		let newsettings = JSON.stringify({
			types: type,
			period: selectedPeriod,
			displayTags: displayTags,
		});
		window.localStorage.setItem("defaultChartSettings", newsettings);
		setButtonState(1);
		window.location.reload();
		return 1;
	};

	useEffect(() => {
		const checkHoursConfig = (value) => {
			let toStringValue = value.toString();
			if (toStringValue == "24") {
				firstRadio.current.checked = true;
				setTimePeriod("24");
				return true;
			} else if (toStringValue == "48") {
				secondRadio.current.checked = true;
				setTimePeriod("48");
				return true;
			} else if (toStringValue == "72") {
				thirdRadio.current.checked = true;
				setTimePeriod("72");
				return true;
			}
			return false;
		};
		let loadedConfig = JSON.parse(
			window.localStorage.getItem("defaultChartSettings")
		);
		if (loadedConfig) {
			if (loadedConfig["types"] && loadedConfig["period"]) {
				console.log();
				setType((type) => ({
					...type,
					...loadedConfig["types"],
				}));
				if (!checkHoursConfig(loadedConfig["period"])) {
					extraRadio.current.checked = true;
					otherPeriod.current.value = parseInt(
						loadedConfig["period"]
					);
					otherPeriod.current.disabled = false;
					setTimePeriod(loadedConfig["period"]);
				}
				if (loadedConfig["displayTags"] !== "undefined") {
					setDisplayTags(loadedConfig["displayTags"]);
				}
			}
		}
	}, []);

	return (
		<div className="main_container">
			<div className="popup">
				<div
					className="popup_closer"
					onClick={() => {
						props.closeModal();
					}}
				>
					X
				</div>
				<h3 className="popup_title">
					Welcome to the default chart configuration!
				</h3>
				<div className="popup_content">
					<div className="popup_leftside">
						<h5>Default type to display:</h5>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: "5px",
							}}
						>
							<input
								type="checkbox"
								checked={type["glucose"]}
								name="glucose"
								id="glucose"
								value="glucose"
								className="form-check-input"
								ref={glucoseCheckbox}
								onChange={(e) => {
									handleChangeValue(e.target);
									checkTypes();
								}}
							/>
							<label htmlFor="glucose">Glucose data</label>
							<input
								type="checkbox"
								checked={type["basal"]}
								name="basal"
								id="basal"
								value="basal"
								className="form-check-input"
								ref={basalCheckbox}
								onChange={(e) => {
									handleChangeValue(e.target);
								}}
							/>
							<label htmlFor="basal">Basal Insulin</label>
							<input
								type="checkbox"
								checked={type["meal"]}
								name="meal"
								id="meal"
								value="meal"
								className="form-check-input"
								ref={mealCheckbox}
								onChange={(e) => {
									handleChangeValue(e.target);
								}}
							/>
							<label htmlFor="meal">Meal bolus</label>
							<input
								type="checkbox"
								checked={type["correction"]}
								name="correction"
								id="correction"
								value="correction"
								className="form-check-input"
								ref={correctionCheckbox}
								onChange={(e) => {
									handleChangeValue(e.target);
								}}
							/>
							<label htmlFor="correction">Correction Bolus</label>
						</div>
						<h5>Select a period to display data:</h5>
						<div className="period_selector">
							<input
								type="radio"
								id="24h"
								name="timePeriod"
								value="24"
								className="form-check-input"
								ref={firstRadio}
								onClick={() => {
									setTimePeriod("24");
									otherPeriod.current.disabled = true;
								}}
							/>
							<label htmlFor="24h" className="form-check-label">
								24h
							</label>
							<input
								type="radio"
								id="48h"
								name="timePeriod"
								value="48"
								className="form-check-input"
								ref={secondRadio}
								onClick={() => {
									setTimePeriod("48");
									otherPeriod.current.disabled = true;
								}}
							/>
							<label htmlFor="48h" className="form-check-label">
								48h
							</label>
							<input
								type="radio"
								id="72h"
								name="timePeriod"
								value="72"
								className="form-check-input"
								ref={thirdRadio}
								onClick={() => {
									setTimePeriod("72");
									otherPeriod.current.disabled = true;
								}}
							/>
							<label htmlFor="72h" className="form-check-label">
								72h
							</label>
							<input
								type="radio"
								name="timePeriod"
								value="other"
								className="form-check-input"
								ref={extraRadio}
								onClick={() => {
									setTimePeriod("other");
									otherPeriod.current.disabled = false;
								}}
							/>
							<input
								type="number"
								placeholder="Enter amount..(1-72)"
								max={72}
								disabled
								ref={otherPeriod}
								onInput={() => {
									setTimePeriod(0);
									if (
										/^\d+$/.test(otherPeriod.current.value)
									) {
										setTimePeriod(
											otherPeriod.current.value
										);
									} else {
										otherPeriod.current.value = "";
									}
								}}
							/>
						</div>
						<h5>Configure tags: </h5>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: "5px",
							}}
						>
							<input
								type="checkbox"
								checked={displayTags}
								name="showTags"
								id="showTags"
								value="glucose"
								className="form-check-input"
								ref={displayTagsCheckbox}
								onChange={() => {
									setDisplayTags(!displayTags);
								}}
							/>
							<label htmlFor="showTags">Display Tags?</label>
						</div>
						{buttonState ? (
							<button
								style={{ alignSelf: "center", color: "white" }}
								className="button good_button"
								disabled
							>
								<img
									src={Checked}
									alt="Finished checked svg"
									className="checked"
								/>
								Config applied!
							</button>
						) : (
							<button
								onClick={handleSubmit}
								style={{ alignSelf: "center" }}
								className="button save_button"
							>
								<img
									src={Save}
									alt="Save logo"
									className="save_logo"
								/>
								Save configuration
							</button>
						)}
						<p ref={errorArea} className="error_message">
							{error}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DefaultChartConfigModal;
