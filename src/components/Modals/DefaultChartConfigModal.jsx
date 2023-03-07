import "../../styles/scss/modals/defaultChartConfigModal.scss";
import { useState, useRef, useEffect } from "react";
import Save from "../../assets/save.svg";
import Checked from "../../assets/checked.svg";

const DefaultChartConfigModal = (props) => {
	const [type, setType] = useState("");
	const [insulinType, setInsulinType] = useState("");
	const [timePeriod, setTimePeriod] = useState(0);
	const [buttonState, setButtonState] = useState(0);
	const [error, setError] = useState("");

	const glucoseRadio = useRef(null);
	const insulinRadio = useRef(null);
	const selectInsulin = useRef(null);
	const otherPeriod = useRef(null);
	const errorArea = useRef("");

	const changeRadio = (element) => {
		let value = element.target.innerText;
		if (value == "Glucose data") {
			glucoseRadio.current.checked = true;
			setType("glucose");
		} else if (value == "Insulin data") {
			insulinRadio.current.checked = true;
			setType("insulin");
		}
		return 1;
	};

	const handleSubmit = () => {
		setError("");
		let selectedType = type;
		let selectedPeriod = timePeriod;
		if (!type || !timePeriod) {
			setError("Please select a type and a valid time period !");
			return 0;
		}
		if (selectedType == "insulin") {
			if (["meal", "basal", "insulin"].includes(insulinType)) {
				selectedType = insulinType;
			} else {
				setError("Please select an insulin type !");
				return 0;
			}
		}
		let newsettings = JSON.stringify({
			type: selectedType,
			period: selectedPeriod,
		});
		window.localStorage.setItem("defaultChartSettings", newsettings);
		setButtonState(1);
		props.reloadChart();
		return 1;
	};

	// useEffect(() => {
	// 	console.log(type);
	// }, [type]);

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
				<h2 className="popup_title">
					Welcome to the default chart configuration!
				</h2>
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
								type="radio"
								value="glucose"
								name="type"
								ref={glucoseRadio}
								onClick={() => {
									setType("glucose");
								}}
								className="form-check-input"
							/>
							<label
								htmlFor="glucose"
								onClick={(e) => {
									changeRadio(e);
								}}
								className="form-check-label"
							>
								Glucose data
							</label>
							<input
								type="radio"
								value="insulin"
								name="type"
								ref={insulinRadio}
								onClick={() => {
									setType("insulin");
								}}
								className="form-check-input"
							/>
							<label
								htmlFor="insulin"
								onClick={(e) => {
									changeRadio(e);
								}}
								className="form-check-label"
							>
								Insulin data
							</label>
							{type == "insulin" ? (
								<div>
									<select
										ref={selectInsulin}
										onChange={() => {
											setInsulinType(
												selectInsulin.current.value
											);
											console.log(insulinType);
										}}
										defaultValue={""}
									>
										<option hidden value="">
											Select a type of insulin
										</option>
										<option value="meal">Meal</option>
										<option value="basal">Basal</option>
										<option value="insulin">Insulin</option>
									</select>
								</div>
							) : (
								""
							)}
						</div>
						<h5>Select a period to display data:</h5>
						<div className="period_selector">
							<input
								type="radio"
								name="timePeriod"
								value="24"
								className="form-check-input"
								onClick={() => {
									setTimePeriod("24");
									otherPeriod.current.disabled = true;
								}}
							/>
							<label htmlFor="24" className="form-check-label">
								24h
							</label>
							<input
								type="radio"
								name="timePeriod"
								value="48"
								className="form-check-input"
								onClick={() => {
									setTimePeriod("48");
									otherPeriod.current.disabled = true;
								}}
							/>
							<label htmlFor="48" className="form-check-label">
								48h
							</label>
							<input
								type="radio"
								name="timePeriod"
								value="72"
								className="form-check-input"
								onClick={() => {
									setTimePeriod("72");
									otherPeriod.current.disabled = true;
								}}
							/>
							<label htmlFor="72" className="form-check-label">
								72h
							</label>
							<input
								type="radio"
								name="timePeriod"
								value="other"
								className="form-check-input"
								onClick={() => {
									setTimePeriod("other");
									otherPeriod.current.disabled = false;
								}}
								on
							/>
							<input
								type="number"
								placeholder="Enter amount..(1-72)"
								max={72}
								disabled
								ref={otherPeriod}
								onInput={() => {
									setTimePeriod(0);
									console.log("Input detected");
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
