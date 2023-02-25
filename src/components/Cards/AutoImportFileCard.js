import {
	postAutoImportCredentials,
	checkAutoImportConfig,
} from "../../services/omgServer";
import { useEffect, useRef, useState } from "react";
import Loading from "../../assets/loading.svg";
import Checked from "../../assets/checked.svg";
import Error from "../../assets/error.svg";
import Save from "../../assets/save.svg";
import "../../styles/scss/cards/autoImport.scss";

const AutoImportFileCard = () => {
	const username = useRef(null);
	const password = useRef(null);
	const country = useRef(null);
	const [error, setError] = useState("");
	const [buttonState, setButtonState] = useState(0);
	const [autoImportConfigured, setAutoImportConfigured] = useState(false);

	const handleSubmit = async () => {
		let credentials = {};
		credentials["username"] = username.current.value;
		credentials["password"] = password.current.value;
		credentials["country"] = country.current.value;
		setError("");
		if (!credentials["username"]) {
			setError("You have to give a username");
			return 0;
		}
		if (!credentials["password"]) {
			setError("You have to give a password");
			return 0;
		}
		if (!credentials["country"]) {
			setError("You have to give a country");
			return 0;
		}
		setButtonState(1);
		let response = await postAutoImportCredentials(
			credentials["username"],
			credentials["password"],
			credentials["country"]
		);
		console.log(response);
		if (response.includes("User already has an account")) {
			setError(
				"The automatic import is already configurated for this user"
			);
			setButtonState(3);
			return 0;
		} else if (response.includes("Provided credentials are not correct")) {
			setError(
				"The connection test to CareLink servers failed! Check the given credentials"
			);
			setButtonState(3);
			return 0;
		}
		setFormToConfiguredState();
	};

	const clearErrors = () => {
		setError("");
		setButtonState(0);
	};

	const setFormToConfiguredState = () => {
		setButtonState(2);
		username.current.disabled = true;
		password.current.disabled = true;
		country.current.disabled = true;
	};

	const initialState = () => {
		setButtonState(0);
		username.current.disabled = false;
		password.current.disabled = false;
		country.current.disabled = false;
	};

	const renderButton = () => {
		if (buttonState == 0) {
			return (
				<button
					onClick={handleSubmit}
					style={{ alignSelf: "center" }}
					className="button save_button"
				>
					<img src={Save} alt="Save logo" className="save_logo" />
					Save
				</button>
			);
		} else if (buttonState == 1) {
			return (
				<button
					onClick={handleSubmit}
					style={{ alignSelf: "center", color: "white" }}
					className="button loading_button"
					disabled
				>
					<img
						src={Loading}
						alt="Loading svg"
						className="loading_logo"
					/>
					Configurating...
				</button>
			);
		} else if (buttonState == 2) {
			return (
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
					Config finished!
				</button>
			);
		} else if (buttonState == 3) {
			return (
				<button
					style={{ alignSelf: "center", color: "white" }}
					className="button error_button"
					onClick={() => {
						clearErrors();
					}}
				>
					<img src={Error} alt="Error svg" className=" checked" />
					An error occured !
				</button>
			);
		}
	};

	const initComponent = async () => {
		let response = await checkAutoImportConfig();
		console.log(response);
		if (response) {
			setFormToConfiguredState();
		} else {
			initialState();
		}
		return 1;
	};

	useEffect(() => {
		initComponent();
	}, []);

	return (
		<div
			className="card d-flex border-bottom-primary shadow h-100 py-2 mb-2 me-2"
			style={{ maxWidth: "350px" }}
		>
			<div className="card-body" style={{ padding: "1rem" }}>
				<div className="flex-d no-gutters align-items-center">
					<div className="col me-2">
						<div className="text fw-bold text-primary text-uppercase">
							Automatic import
						</div>
					</div>
				</div>
				<hr className="sidebar-divider" />
				<form className="ms-2 me-2">
					{/* <div className="row form-group" style={{ margin: "2px" }}>
						<label
							className="form-check-label"
							htmlFor="ManufacturerSelector"
						>
							Manufacturer (more comming)
						</label>
						<select
							className="form-control"
							id="ManufacturerSelector"
							name="pumpModel"
						>
							<option value="minimed">Medtronic</option>
						</select>
						<div className="invalid-feedback">
							You have to choose a model
						</div>
					</div> */}
					<div className="row form-group" style={{ margin: "3px" }}>
						<label className="form-check-label" htmlFor="username">
							Username
						</label>
						<input
							type="text"
							className="form-control"
							id="username"
							ref={username}
						/>
						<div className="invalid-feedback">
							You have to enter a username
						</div>
					</div>
					<div className="row form-group" style={{ margin: "3px" }}>
						<label className="form-check-label" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							className="form-control"
							id="password"
							ref={password}
						/>
						<div className="invalid-feedback">
							You have to enter a password
						</div>
					</div>
					<div className="row form-group" style={{ margin: "3px" }}>
						<label className="form-check-label" htmlFor="country">
							Country code
						</label>
						<input
							type="text"
							className="form-control"
							id="country"
							placeholder="ex: BE, US..."
							ref={country}
						/>
						<div className="invalid-feedback">
							You have to enter a country
						</div>
					</div>
				</form>
				<div className="d-flex justify-content-center">
					{renderButton()}
				</div>
				{error ? (
					<div
						className="invalid-feedback text-center"
						style={{ display: "block" }}
					>
						<p className="mb-0">{error}</p>
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default AutoImportFileCard;
