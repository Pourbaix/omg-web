import React, { Component } from "react";
import {
	postUpload,
	getRangesWithFormattedTimes,
	getBolusWithFormattedDateAndTime,
	postPendingTag,
} from "../../services/omgServer";
import { useRoundMinutesAndAddSummerTime } from "../../hooks/useRoundMinutesAndAddSummerTime";
import { Navigate } from "react-router-dom";

/**
 * component that implements the method of importing the data of a user via a CSV file
 */
class ImportFileCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			upload: "", // state of the upload (0 -> not started, 1 -> request sent, 2 -> success, 3 -> detecting event -1 -> error)
			file: "", // CSV data file
			sensorModel: "minimed", // Chosen model pump
			resultRequest: "", // API results of the request
			importName: "", // Name of the import saved in database for deletion
			redirect: false,
		};
	}

	roundTo5Minutes(date) {
		let coeff = 1000 * 60 * 5;
		return new Date(Math.round(date.getTime() / coeff) * coeff);
	}

	getDatePickerFormat(date) {
		// let initDate = useRoundMinutesAndAddSummerTime(date, 1);
		let initDate = this.roundTo5Minutes(date);
		initDate.setUTCHours(
			initDate.getUTCHours() - initDate.getTimezoneOffset() / 60
		);
		return initDate.toISOString().substr(0, 16);
	}

	/**
	 * manages the sending and the result of the data import request.
	 */
	uploadFile = async () => {
		if (this.state.sensorModel !== "none") {
			if (this.state.file) {
				if (this.state.importName) {
					this.setState({ upload: 1 });
					let res = await postUpload(
						document.getElementById("dataFileAutoInput"),
						this.state.sensorModel,
						this.state.importName
					);
					if (res[0].ok) {
						this.setState({ upload: 3 });
						let ranges = await getRangesWithFormattedTimes();
						if (ranges.length) {
							console.log(ranges);
							this.setState({ upload: 4 });
						}
						let bolusEvents =
							await getBolusWithFormattedDateAndTime(
								res[1].firstDataDatetime
							);
						// console.log(bolusEvents);
						if (bolusEvents.length) {
							this.setState({ upload: 5 });
						}
						let pendingTags = [];
						for (const range of ranges) {
							let prevDate = [];
							let prevDateAndTime = [];
							// bolusEvents.reverse();
							for (const event of bolusEvents) {
								let date = event.date;
								let time = event.time;

								// on remplace les - de la date par des /
								let cleanedDate = date.replace(/-/g, "/");
								// On crée une nouvelle date a partir de la date formatée et le time
								// Cette date est en UTC 0
								let initBolusDate = new Date(
									cleanedDate + " " + time
								);

								/// Code inutilisé car on utilise maintenant les date et time en UTC0

								// code pour mettre en heure locale (db-->ui)
								// CODE Potentiellement inutile
								// let basicBolusGmt = new Date(
								// 	initBolusDate.setUTCHours(
								// 		initBolusDate.getUTCHours() -
								// 			initBolusDate.getTimezoneOffset() /
								// 				60
								// 	)
								// );

								// Code pour mettre un 0 devant l'heure ou la minute au cas ou c'est inférieur à 10
								// Sert pour le formatage de l'heure
								// let zeroHours =
								// 	basicBolusGmt.getHours() < 10 ? "0" : "";
								// let zeroMinutes =
								// 	basicBolusGmt.getMinutes() < 10 ? "0" : "";
								// let timeSameGmt =
								// 	zeroHours +
								// 	basicBolusGmt.getHours() +
								// 	":" +
								// 	zeroMinutes +
								// 	basicBolusGmt.getMinutes();

								// Si la données de bolus se situe dans la range
								// Les deux données sont en UTC0 donc on peut les comparer
								if (time >= range.from && time <= range.to) {
									// daysNumbers = les jours qui ont été sélectionnés lors de la création de la range
									let daysNumbers = range.daysNumbers;

									// Si le jour du tag correspond à un des jours pris en charge par la range
									if (
										daysNumbers.includes(
											new Date(cleanedDate).getDay()
										)
									) {
										// const datetime =
										// 	this.roundTo5Minutes(initBolusDate);

										// La datetime du bolus de repas en UTC 0
										const datetime = initBolusDate;

										// On init le pending tag qui sera envoyé pour être inséré dans la DB
										let pendingTag = {};
										pendingTag.pendingName = range.name;
										pendingTag.pendingDatetime = datetime;

										// Si un autre bolus de repas a déjà été append qui appartient à la même journée
										// Vérifier si c'est bien le premier bolus de la range
										if (prevDate.includes(cleanedDate)) {
											// On parcourt tous les éléments dans prevDateTime à la recherche d'une datetime égale avec un time plus petit
											for (
												let i = 0;
												i < prevDateAndTime.length;
												i++
											) {
												// Si la date est la mm que cleanedDate
												if (
													prevDateAndTime[i].substr(
														0,
														10
													) === cleanedDate
												) {
													let minTime =
														prevDateAndTime[
															i
														].substr(11, 5);
													if (time < minTime) {
														// prevTime est déjà dans PendingTag mais où ? faut le retrouver et puis le remplacer par datetime
														pendingTags.forEach(
															(tag, ind, arr) => {
																if (
																	tag.pendingDatetime ==
																	prevDateAndTime[
																		i
																	].substr(
																		17,
																		prevDateAndTime[
																			i
																		]
																			.length -
																			17
																	)
																) {
																	if (
																		prevDateAndTime[
																			i
																		].substr(
																			5,
																			2
																		) ==
																		"05"
																	) {
																	}

																	tag.pendingDatetime =
																		datetime;
																	prevDate.push(
																		cleanedDate
																	);
																	prevDateAndTime.push(
																		cleanedDate +
																			" " +
																			time +
																			" " +
																			datetime
																	);
																}
															}
														);
													}
												}
											}
										} else {
											pendingTag.pendingName = range.name;
											pendingTag.pendingDatetime =
												datetime;
											pendingTags.push(pendingTag);

											prevDate.push(cleanedDate);
											prevDateAndTime.push(
												cleanedDate +
													" " +
													time +
													" " +
													datetime
											);
										}
									}
								}
							}
						}
						// We need to convert the dates in UTC 0 because they are in + 2 now but with the correct hours which is not valid to store in DB
						// F.E. If we have 12:00:00, the tag is really stored at 12:00:00 in the DB but it is UTC0 or the 12:00:00 that we have for the pending tag is GMT +2 or +1
						let UTC0PendingTags = [];
						pendingTags.forEach((tag) => {
							let tempTag = {};
							tempTag["pendingName"] = tag.pendingName;

							let currentDate = new Date(tag.pendingDatetime);

							let tempDate = new Date(tag.pendingDatetime);
							tempDate.setUTCHours(currentDate.getHours());

							tempTag["pendingDatetime"] = tempDate;
							UTC0PendingTags.push(tempTag);
						});
						let insertIntoTag = await postPendingTag(
							UTC0PendingTags
						); // pendingtags contient bien 1/range mais faut que ce soit le premier
						if (ranges.length) {
							this.setState({ upload: 2 });
							if (insertIntoTag === "alreadyexists") {
								this.setState({
									resultRequest:
										"⚠️All detected tags are already existing.",
								});
							}
							if (insertIntoTag === "redirect") {
								this.setState({ redirect: true });
							}
						} else {
							this.setState({ upload: 2 });
						}
					} else {
						this.setState({ upload: -1 });
					}
				} else {
					if (
						!document
							.getElementById("importName")
							.classList.contains("is-invalid")
					) {
						document
							.getElementById("importName")
							.classList.add("is-invalid");
					}
				}
			} else {
				if (
					!document
						.getElementById("dataFileAutoInput")
						.classList.contains("is-invalid")
				) {
					document
						.getElementById("dataFileAutoInput")
						.classList.add("is-invalid");
				}
			}
		} else {
			if (
				!document
					.getElementById("sensorModelSelector")
					.classList.contains("is-invalid")
			) {
				document
					.getElementById("sensorModelSelector")
					.classList.add("is-invalid");
			}
		}
	};

	// roundTo5MinutesAndAddSummerTime = (date) => {
	//     let coeff = 1000 * 60 * 5;
	//     let rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
	//
	//     return new Date(rounded.setHours(rounded.getHours()+1));
	// }

	fileChange = (event) => {
		let now = new Date(Date.now());
		let filename =
			document.getElementById("dataFileAutoInput").files[0].name +
			" - " +
			now.toLocaleString();
		this.setState({ file: event.target.value, importName: filename });
		document.getElementById("importName").value = filename;
		if (
			document
				.getElementById("dataFileAutoInput")
				.classList.contains("is-invalid")
		) {
			document
				.getElementById("dataFileAutoInput")
				.classList.remove("is-invalid");
		}
		if (
			document
				.getElementById("importName")
				.classList.contains("is-invalid")
		) {
			document
				.getElementById("importName")
				.classList.remove("is-invalid");
		}
		this.setState({ upload: 0 });
	};

	importNameChange = (event) => {
		this.setState({ importName: event.target.value });
		if (
			document
				.getElementById("importName")
				.classList.contains("is-invalid")
		) {
			document
				.getElementById("importName")
				.classList.remove("is-invalid");
		}
		this.setState({ upload: 0 });
	};

	sensorModelChange = (event) => {
		this.setState({ sensorModel: event.target.value });
		if (
			document
				.getElementById("sensorModelSelector")
				.classList.contains("is-invalid")
		) {
			document
				.getElementById("sensorModelSelector")
				.classList.remove("is-invalid");
		}
		this.setState({ upload: 0 });
	};

	/**
	 * manages the display of the status of the data import request
	 *
	 * @return {JSX.Element}
	 */
	uploadResults() {
		let upBtn = document.getElementById("uploadButton");
		if (this.state.upload === -1) {
			this.changeUploadButtonStatus("fa-times", "btn-danger", "error");
			document.getElementById("uploadButtonInvalidText").innerText =
				this.state.resultRequest;
		}
		if (this.state.upload === 0) {
			this.changeUploadButtonStatus(
				"fa-upload",
				"btn-primary",
				"upload data"
			);
			upBtn.removeAttribute("disabled");
			document.getElementById("uploadButtonInvalidText").innerText = "";
		}
		if (this.state.upload === 1) {
			// this.changeUploadButtonStatus("fa-sync-alt", "btn-primary", "uploading...");
		}
		if (this.state.upload === 2) {
			this.changeUploadButtonStatus(
				"fa-check",
				"btn-success",
				"uploaded !"
			);
			document.getElementById("uploadButtonInvalidText").innerText =
				this.state.resultRequest;
		}
		if (this.state.upload === 3) {
			this.changeUploadButtonStatus(
				"fa-sync-alt",
				"btn-success",
				"getting the detection config..."
			);
		}
		if (this.state.upload === 4) {
			this.changeUploadButtonStatus(
				"fa-sync-alt",
				"btn-success",
				"getting bolus events..."
			);
		}
		if (this.state.upload === 5) {
			this.changeUploadButtonStatus(
				"fa-sync-alt",
				"btn-success",
				"detecting events..."
			);
		}
	}

	/**
	 * Visual change of upload button
	 *
	 * @param newIcon
	 * @param newBtnColor
	 * @param btnText
	 */
	changeUploadButtonStatus = (newIcon, newBtnColor, btnText) => {
		let upBtn = document.getElementById("uploadButton");
		let upBtnIcn = document.getElementById("uploadButtonIcon");
		let upBtnTxt = document.getElementById("uploadButtonText");
		upBtnIcn.classList.forEach((className) => {
			if (className.startsWith("fa-")) {
				upBtnIcn.classList.remove(className);
			}
		});
		upBtn.classList.forEach((className) => {
			if (
				className.startsWith("btn-primary") ||
				className.startsWith("btn-danger") ||
				className.startsWith("btn-success")
			) {
				upBtn.classList.remove(className);
			}
		});
		upBtn.setAttribute("disabled", "true");
		upBtn.classList.add(newBtnColor);
		upBtnIcn.classList.add(newIcon);
		upBtnTxt.innerText = btnText;
	};

	showButton() {
		if (this.state.upload === 1) {
			return (
				<button
					id={"uploadButton"}
					className="btn btn-primary"
					type="button"
					disabled
				>
					<span
						id={"uploadButtonIcon"}
						className="spinner-grow spinner-grow-sm"
						role="status"
						aria-hidden="true"
					></span>
					<span id={"uploadButtonText"} className="text">
						Loading...
					</span>
				</button>
			);
		} else {
			return (
				<button
					id={"uploadButton"}
					className="btn btn-primary btn-icon-split"
					onClick={this.uploadFile}
				>
					<span className="icon text-white-50">
						<i id={"uploadButtonIcon"} className="fas fa-upload" />
					</span>
					<span id={"uploadButtonText"} className="text">
						Upload data
					</span>
				</button>
			);
		}
	}

	render() {
		if (this.state.redirect) return <Navigate to="/pendingtags" />;
		return (
			<div>
				<div
					id="uploadCard"
					className="card d-flex border-bottom-primary shadow h-100 py-2 mb-3 me-3"
				>
					<div className="card-body">
						<div className="flex-d no-gutters align-items-center">
							<div className="col me-2">
								<div className="text fw-bold text-primary text-uppercase">
									File import
								</div>
							</div>
						</div>
						<hr className="sidebar-divider" />
						<form className="ms-2 me-2" id="uploadForm">
							<div className="row form-group">
								<label
									className={"form-check-label"}
									htmlFor="sensorModelSelector"
								>
									Sensor model
								</label>
								<select
									className="form-control"
									id="sensorModelSelector"
									name="pumpModel"
									onChange={this.sensorModelChange}
								>
									<option value="minimed">MiniMed</option>
									<option value="none">
										No other model yet...
									</option>
								</select>
								<div className={"invalid-feedback"}>
									You have to choose a model
								</div>
							</div>
							<div className="row form-group mt-2">
								<label
									className={"form-check-label"}
									htmlFor="importName"
								>
									Import name (default : filename)
								</label>
								<input
									type="text"
									className={"form-control"}
									id="importName"
									onChange={this.importNameChange}
								/>
								<div className={"invalid-feedback"}>
									You have to enter a import name
								</div>
							</div>
							<div className="row form-group mt-2">
								<label
									className={"form-check-label"}
									htmlFor="dataFileAutoInput"
								>
									Sensor data CSV
								</label>
								<input
									type="file"
									className="form-control-file"
									id="dataFileAutoInput"
									name="file"
									accept=".csv"
									onChange={this.fileChange}
								/>
								<div className={"invalid-feedback"}>
									You have to choose a CSV file
								</div>
							</div>
						</form>
						<div className="d-flex align-items-center justify-content-end me-2">
							<div
								id={"uploadButtonInvalidText"}
								className={"text-danger me-4"}
							/>
							{this.showButton()}
						</div>
						<div className="float-end d-flex align-items-center gap-1">
							<input
								className="form-check-input "
								type="checkbox"
								id={"checkIt"}
								defaultChecked
							/>
							<label
								className="form-check-label "
								htmlFor={"checkIt"}
							>
								auto detection
							</label>
						</div>
						{this.uploadResults()}
					</div>
				</div>
			</div>
		);
	}
}

export default ImportFileCard;
