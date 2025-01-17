import React, { Component } from "react";
import Calendar from "react-calendar";
import "../styles/scss/utilities/data_calendar.css";
import {
	deleteAll,
	deleteFile,
	getDataDays,
	getImportNames,
	checkMissingData,
} from "../services/omgServer";
import CardBasicTitle from "../components/Cards/CardBasicTitle";

/**
 * Data manager page of the web application
 */
class DataManager extends Component {
	state = {
		dataDays: [],
		importNames: [],
		missingDataList: [],
		selectedImport: "none",
		deleteResults: "",
	};

	selectedImportChange = (event) =>
		this.setState({ selectedImport: event.target.value });

	sortData = (data) => {
		let final_data = [];
		data.forEach((element) => {
			let diff =
				new Date(element.end).getTime() -
				new Date(element.start).getTime();
			if (diff > 86400000) {
				final_data.push({
					dates: element,
					type: "urgent",
				});
			} else if (diff > 43200000) {
				final_data.push({ dates: element, type: "warning" });
			} else {
				final_data.push({ dates: element, type: "normal" });
			}
		});
		return final_data;
	};

	refresh = () => {
		getDataDays().then((res) => {
			res = res.map((date) => new Date(date));
			res.forEach((date) => date.setHours(0, 0, 0, 0));
			this.setState({ dataDays: res.map((date) => date.toISOString()) });
		});

		if (this.state.dataDays.length > 0) {
			let select = document.getElementById("revertImportSelector");
			for (let i = 1; i < select.childNodes.length; i) {
				select.childNodes[i].remove();
			}
		}

		getImportNames().then((res) => this.setState({ importNames: res }));

		checkMissingData().then((res) => {
			let sorted = this.sortData(res);
			function sortByTypeUrgent(element) {
				if (element.type == "urgent") {
					return 1;
				} else {
					return -1;
				}
			}
			function sortByTypeWarning(element) {
				if (element.type == "urgent" || element.type == "warning") {
					return 1;
				} else {
					return -1;
				}
			}

			this.setState({
				missingDataList: sorted
					.sort(sortByTypeWarning)
					.reverse()
					.sort(sortByTypeUrgent)
					.reverse(),
			});
		});
	};

	componentDidMount() {
		this.refresh();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.dataDays.length > 0) {
			if (this.state.importNames !== prevState.importNames) {
				document
					.getElementById("revertButton")
					.setAttribute("disabled", "true");
				if (this.state.importNames.length > 0) {
					document.getElementById(
						"selectedOptionRevertImportSelector"
					).innerText = "Choose an import";
					this.state.importNames.forEach((name) => {
						let opt = document.createElement("option");
						opt.value = name;
						opt.textContent = name;
						document
							.getElementById("revertImportSelector")
							.appendChild(opt);
					});
				}
			}

			if (this.state.selectedImport !== prevState.selectedImport) {
				let rvtBtn = document.getElementById("revertButton");
				if (document.getElementById("revertForm").hasChildNodes()) {
					document
						.getElementById("revertForm")
						.childNodes.item(0)
						.remove();
				}
				if (rvtBtn.classList.contains("btn-warning")) {
					rvtBtn.classList.remove("btn-warning");
					rvtBtn.classList.add("btn-outline-warning");
					rvtBtn.innerText = "Revert";
				}
				if (this.state.selectedImport === "none") {
					rvtBtn.setAttribute("disabled", "true");
				} else {
					rvtBtn.removeAttribute("disabled");
				}
			}
		}
	}

	revertClick = () => {
		let rvtBtn = document.getElementById("revertButton");
		if (this.state.selectedImport !== "none") {
			if (rvtBtn.classList.contains("btn-outline-warning")) {
				rvtBtn.classList.remove("btn-outline-warning");
				rvtBtn.classList.add("btn-warning");
				rvtBtn.innerText = "Are you sure ?";
			} else if (rvtBtn.classList.contains("btn-warning")) {
				rvtBtn.setAttribute("disabled", "true");
				rvtBtn.innerText = "deleting...";
				deleteFile(this.state.selectedImport).then((res) => {
					if (res[0].ok) {
						rvtBtn.innerText = "data deleted";
						this.refresh();
					} else {
						rvtBtn.innerText = "Error";
						let node = document
							.createElement("p")
							.appendChild(
								document.createTextNode(
									"Something wrong happened"
								)
							);
						document.getElementById("revertForm").appendChild(node);
					}
				});
			}
		}
	};

	eraseClick = () => {
		let eraseBtn = document.getElementById("eraseButton");
		if (eraseBtn.classList.contains("btn-outline-danger")) {
			eraseBtn.classList.remove("btn-outline-danger");
			eraseBtn.classList.add("btn-danger");
			eraseBtn.innerText = "Are you sure ?";
		} else if (eraseBtn.classList.contains("btn-danger")) {
			eraseBtn.setAttribute("disabled", "true");
			eraseBtn.innerText = "deleting...";
			deleteAll(this.state.selectedImport).then((res) => {
				if (res[0].ok) {
					eraseBtn.innerText = "data deleted";
					this.refresh();
				} else {
					eraseBtn.innerText = "Error";
					let node = document
						.createElement("p")
						.appendChild(
							document.createTextNode("Something wrong happened")
						);
					document.getElementById("eraseForm").appendChild(node);
				}
			});
		}
	};

	setCalendar() {
		let calendar = <p className={"text-center"}>No data available</p>;
		console.log(this.state.dataDays.length);
		if (this.state.dataDays.length > 0) {
			calendar = (
				<div>
					<Calendar
						tileClassName={({ date, view }) => {
							return view === "month" &&
								this.state.dataDays.includes(date.toISOString())
								? "text-success"
								: "text-danger";
						}}
					/>
					<hr className="sidebar-divider" />
					<div className="d-flex justify-content-between ms-2 me-4">
						<p>
							<span className={"text-success"}>Green</span> -
							contain data
						</p>
						<p>
							<span className={"text-danger"}>Red</span> - no data
						</p>
					</div>
				</div>
			);
		}
		return calendar;
	}

	setDeleteCard() {
		let ret = <div />;
		if (this.state.dataDays.length > 0) {
			ret = (
				<div style={{ maxWidth: "450px" }}>
					<CardBasicTitle color={"warning"} title={"Delete data"}>
						<p className={"text-danger text-center"}>
							Warning ! These operations are irreversible
						</p>
						<p className={"fw-bold"}>Revert an import</p>
						<div
							className="d-flex align-items-start flex-column"
							style={{ gap: "5px" }}
						>
							<select
								id={"revertImportSelector"}
								className={"form-control"}
								onChange={this.selectedImportChange}
								defaultValue={"none"}
								style={{ maxWidth: "300px" }}
							>
								<option
									id={"selectedOptionRevertImportSelector"}
									value={"none"}
								>
									Loading...
								</option>
							</select>
							<button
								id={"revertButton"}
								className={"btn btn-outline-warning"}
								onClick={this.revertClick}
							>
								Revert
							</button>
						</div>
						<div
							id={"revertForm"}
							className={"text-center text-danger mt-2"}
						/>
						<div className={"mt-4"} />
						<p className={"fw-bold"}>Erase all data</p>
						<button
							id={"eraseButton"}
							className={"btn btn-outline-danger"}
							onClick={this.eraseClick}
						>
							Delete all data
						</button>
						<div
							id={"eraseForm"}
							className={"text-center text-danger mt-2"}
						/>
					</CardBasicTitle>
				</div>
			);
		}
		return ret;
	}

	setRangesWithNoData() {
		return (
			<div>
				<CardBasicTitle
					color={"warning"}
					title={"Ranges with no data"}
					className="m-0"
				>
					<p>List of all period of time without any data:</p>
					<div style={{ maxHeight: "45vh", overflowY: "auto" }}>
						{this.state.missingDataList.map((e) => {
							return (
								<div
									className={
										e.type == "urgent"
											? "d-flex p-2 border border-danger border-2 rounded m-1"
											: e.type == "warning"
											? "d-flex p-2 border border-warning border-2 rounded m-1"
											: "d-flex p-2 border border-2 rounded m-1"
									}
									style={{ gap: "5px" }}
									key={e.dates.start + e.dates.end}
								>
									<p className="mb-0 fst-italic text-center">
										{new Date(e.dates.start)
											.toLocaleString()
											.slice(0, -3)}
									</p>
									<p className="mb-0 fw-bold text-center">
										To
									</p>
									<p className="mb-0 fst-italic text-center">
										{new Date(e.dates.end)
											.toLocaleString()
											.slice(0, -3)}
									</p>
								</div>
							);
						})}
					</div>
					<div className="mt-3">
						<div className="d-flex align-items-center">
							<div
								className="border border-danger border-2 rounded"
								style={{
									width: "15px",
									height: "15px",
								}}
							></div>{" "}
							<p className="m-0 ms-2">More than one day</p>
						</div>
						<div className="d-flex align-items-center">
							<div
								className="border border-warning border-2 rounded"
								style={{
									width: "15px",
									height: "15px",
								}}
							></div>{" "}
							<p className="m-0 ms-2">More than half a day</p>
						</div>
						<div className="d-flex align-items-center">
							<div
								className="border border-2 rounded"
								style={{
									width: "15px",
									height: "15px",
								}}
							></div>{" "}
							<p className="m-0 ms-2">Less than half a day</p>
						</div>
					</div>
				</CardBasicTitle>
			</div>
		);
	}

	render() {
		return (
			<div className="container-fluid ms-2 me-2 d-flex flex-wrap align-items-start">
				<CardBasicTitle title={"Available data"}>
					{this.setCalendar()}
				</CardBasicTitle>
				{this.setDeleteCard()}
				{this.setRangesWithNoData()}
			</div>
		);
	}
}

export default DataManager;
