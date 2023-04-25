import React, { Component } from "react";
import CardBasicTitle from "../components/Cards/CardBasicTitle";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import CardMobile from "../components/Cards/CardMobile";
import {
	getCountAllRanges,
	getRangesHistory,
	postRange,
} from "../services/omgServer";
import EditTagActivationDialog from "../components/Dialogs/EditTagActivationDialog";
import DeleteTagActivationDialog from "../components/Dialogs/DeleteTagActivationDialog";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNumberToArrayDayNameNumber } from "../hooks/useNumberToArrayDayNameNumber";
import { useDayToAddDayInArray } from "../hooks/useDayToAddDayInArray";
import { useFormatStringForId } from "../hooks/useFormatStringForId";
import { useHasMore } from "../hooks/useHasMore";

class TagDetection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chosenDetectionTag: "",
			fromTime: null,
			toTime: null,
			weekDaysSelected: [],
			daysName: "",
			status: "",
			rangesHistoryCount: 3,
			// get created range will fill this array
			rangesHistory: [],
		};
	}

	componentDidMount() {
		getCountAllRanges().then((res) =>
			this.setState({ rangesHistoryCount: res })
		);
		this.getAllRanges();
	}

	getAllRanges() {
		getRangesHistory().then((res) => {
			if (res) {
				Promise.all(
					res.map((range) => {
						range.fromTime = range.fromTime.substring(0, 5);
						range.toTime = range.toTime.substring(0, 5);
						// let daysNumbers = [];
						// let bitDays = range.daysSelected.toString(2);
						// let j = 0;
						// for (let i = bitDays.length; i > 0; i--) {
						//     // console.log(bitDays[i-1]);
						//     if (bitDays[i - 1] == "1") {
						//         daysNumbers.push(j);
						//     }
						//     j++;
						// }
						const daysNumbers = useNumberToArrayDayNameNumber(
							range.daysSelected
						);
						// console.log("ici   "+ daysNumbers);
						let daysSelectedString = "";
						for (let dayNumber of daysNumbers) {
							switch (dayNumber) {
								case 0:
									daysSelectedString += "Sun, ";
									break;
								case 1:
									daysSelectedString += "Mon, ";
									break;
								case 2:
									daysSelectedString += "Tue, ";
									break;
								case 3:
									daysSelectedString += "Wed, ";
									break;
								case 4:
									daysSelectedString += "Thu, ";
									break;
								case 5:
									daysSelectedString += "Fri, ";
									break;
								case 6:
									daysSelectedString += "Sat, ";
									break;
							}
						}
						// this.setState({daysName: daysSelectedString})
						range["daysString"] = daysSelectedString;
					})
				).then(() => this.setState({ rangesHistory: res }));
			} else {
				console.log(res);
			}
		});
	}

	detectionTagInputChange = (event) => {
		this.setState({ chosenDetectionTag: event.target.value });
		// console.log('input value :\n'+ event.target.value);
		// console.log('state chosenDetectionTag :\n'+ this.state.chosenDetectionTag);
		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	};

	setFrom = (event) => {
		this.setState({ fromTime: event.target.value });
		// console.log('from input :\n'+ event.target.value);
		// console.log('from state :\n'+ this.state.fromTime);
		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	};

	setTo = (event) => {
		this.setState({ toTime: event.target.value });
		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	};

	weekDaysChange(day) {
		// let selected = this.state.weekDaysSelected
		// let find = selected.indexOf(day)
		//
		// if(find > -1) {
		//     selected.splice(find, 1);
		// } else {
		//     selected.push(day);
		// }
		this.setState({
			weekDaysSelected: useDayToAddDayInArray(
				day,
				this.state.weekDaysSelected
			),
		});
		// console.log(selected);
		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	}

	basicConfirmButtonClick = () => {
		if (
			this.state.chosenDetectionTag &&
			this.state.fromTime &&
			this.state.toTime
		) {
			// console.log("loading");
			// console.log("format data to post");
			// console.log("post name, from, to and optionally days\nthen success or error");
			let newRange = {};
			newRange.name = this.state.chosenDetectionTag;
			newRange["fromTime"] = this.state.fromTime;
			newRange["toTime"] = this.state.toTime;
			let sum = 127;
			if (this.state.weekDaysSelected.length > 0) {
				sum = this.state.weekDaysSelected.reduce(
					(accumulator, value) => {
						return accumulator + value;
					},
					0
				);
			}
			newRange["daysSelected"] = sum;
			// newRange["daysSelected"] = this.state.weekDaysSelected;
			let currentCount = this.state.rangesHistoryCount;
			this.setState({ rangesHistoryCount: currentCount++ });
			let rangesHistoryNew = this.state.rangesHistory;
			rangesHistoryNew.unshift(newRange);
			this.setState({ rangesHistory: rangesHistoryNew });
			// console.log(this.state.rangesHistoryCount);
			// console.log(JSON.stringify(newRange)); // {"name":"fr","fromTime":"19:53","toTime":"19:53","daysSelected":112}
			// OK donc newrange doit être envoyé en db
			this.setState({ status: 1 });
			console.log(
				newRange.name,
				newRange.fromTime,
				newRange.toTime,
				newRange.daysSelected
			);
			postRange(
				this.state.chosenDetectionTag,
				this.state.fromTime,
				this.state.toTime,
				sum
			).then((res) => {
				if (res) {
					// this.setState({status: 2});
					// this.getAllRanges();
					window.location.reload(false);
				} else {
					this.setState({ status: -1 });
				}
			});
		} else {
			document.getElementById("basicConfirmButtonInvalidText").innerText =
				"Tag name and time range required";
		}
	};

	// formatStringForId = (str) => {
	//     // let regex = /[A-Za-z]|[0-9]|\.|\-|\:|\_/gi;
	//     let regex = /[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\uFFFF]/gu;
	//     let newStr = str.replaceAll(regex, '');
	//     return newStr;
	// }

	manualTagInput() {
		return (
			<div>
				<input
					id={"detectionTagInput"}
					className={
						"form-control form-control-plaintext border ps-2 border-bottom-primary"
					}
					placeholder={"Enter a name"}
					onChange={this.detectionTagInputChange}
				/>
			</div>
		);
	}

	setDaysCheckboxes() {
		let weekDays = [
			["Sun", 1],
			["Mon", 2],
			["Tue", 4],
			["Wed", 8],
			["Thu", 16],
			["Fri", 32],
			["Sat", 64],
		];
		let checkboxes = [];
		weekDays.forEach((day) => {
			checkboxes.push(
				<div
					key={"checkboxItem" + day[0]}
					className="form-check form-check-inline"
				>
					<input
						className="form-check-input"
						type="checkbox"
						key={"checkbox" + day[0]}
						id={"checkbox" + day[0]}
						value={day[1]}
						onChange={() => this.weekDaysChange(day[1])}
					/>
					<label
						className="form-check-label"
						htmlFor={"checkbox" + day[0]}
					>
						{day[0]}
					</label>
				</div>
			);
		});
		return checkboxes;
	}

	showBasicConfirmButton() {
		return (
			<div className="mt-4 align-self-center d-flex flex-column">
				<div
					id={"basicConfirmButtonInvalidText"}
					className={"text-danger mb-2 align-self-center"}
				/>
				<button
					id={"basicConfirmButton"}
					className="btn btn-primary align-self-center"
					onClick={this.basicConfirmButtonClick}
				>
					<span id={"basicConfirmButtonText"} className="text">
						Create range
					</span>
				</button>
			</div>
		);
	}

	changeBasicConfirmButtonStatus = (newBtnColor, btnText) => {
		let basicBtn = document.getElementById("basicConfirmButton");
		let basicBtnTxt = document.getElementById("basicConfirmButtonText");
		basicBtn.classList.forEach((className) => {
			if (
				className.startsWith("btn-primary") ||
				className.startsWith("btn-danger") ||
				className.startsWith("btn-success")
			) {
				basicBtn.classList.remove(className);
			}
		});
		basicBtn.setAttribute("disabled", "true");
		basicBtn.classList.add(newBtnColor);
		basicBtnTxt.innerText = btnText;
	};

	activationResults() {
		let basicBtn = document.getElementById("basicConfirmButton");
		if (this.state.status === -1) {
			this.changeBasicConfirmButtonStatus("btn-danger", "error");
			document.getElementById("basicConfirmButtonText").innerText =
				this.state.resultRequest;
			// document.getElementById("basicConfirmButtonText").innerText = "error";
		}
		if (this.state.status === 0) {
			this.changeBasicConfirmButtonStatus("btn-primary", "Create range");
			basicBtn.removeAttribute("disabled");
			document.getElementById("basicConfirmButtonInvalidText").innerText =
				"";
		}
		if (this.state.status === 1) {
			this.changeBasicConfirmButtonStatus("btn-primary", "activating...");
		}
		if (this.state.status === 2) {
			this.changeBasicConfirmButtonStatus(
				"btn-success",
				"range created !"
			);
		}
	}

	showDays(daysString) {
		// let message = !days.length ? <div>Every day</div> : days.map((day) => (
		//     <div>{day}</div>
		// ));
		// return message;
		return <div>{daysString}</div>;
	}

	showCreatedRange() {
		let message = <CardMobile>No range found</CardMobile>;
		if (this.state.rangesHistory) {
			message = this.state.rangesHistory.map((range, i) => (
				<div
					key={
						"containerRangesHistoryCard" +
						useFormatStringForId(range["name"]) +
						this.state.rangesHistory.indexOf(range)
					}
				>
					<CardMobile>
						{/* <!-- Card Header - Accordion --> */}
						<a
							href={
								"#rangeCard" +
								useFormatStringForId(range["name"]) +
								this.state.rangesHistory.indexOf(range)
							}
							className="card-header collapsed"
							data-bs-toggle="collapse"
							role="button"
							aria-expanded="true"
							aria-controls={
								"rangeCard" +
								range["name"] +
								this.state.rangesHistory.indexOf(range)
							}
						>
							<div className={"d-flex justify-content-between"}>
								<div className={"fw-bold text-lg text-primary"}>
									{range["name"]}
								</div>
								<div
									className={
										"text-lg text-center mt-2 text-gray-700"
									}
								>
									From {range["fromTime"]} to{" "}
									{range["toTime"]}
								</div>
								<div
									className={
										"text-lg text-center mt-2 text-gray-700"
									}
								>
									{this.showDays(range["daysString"])}
								</div>
							</div>
						</a>
						{/*<!-- Card Content - Collapse -->*/}
						<div
							className="collapse"
							id={
								"rangeCard" +
								useFormatStringForId(range["name"]) +
								this.state.rangesHistory.indexOf(range)
							}
						>
							<div className="card-body d-flex justify-content-around">
								<EditTagActivationDialog
									rangeName={range["name"]}
									rangeFrom={range["fromTime"]}
									rangeTo={range["toTime"]}
									rangeDaysSelected={range["daysSelected"]}
									rangeId={range["id"]}
									tagDatetime={"2021-02-12"}
								/>
								<DeleteTagActivationDialog
									rangeId={range["id"]}
								/>
								{/*<button>future edit</button>*/}
								{/*<button>future delete</button>*/}
								{/*<EditrangeActivationDialog rangeName={range["name"]} rangeDatetime={range["startDatetime"]} rangeId={range["id"]}/>*/}
								{/*<DeleterangeActivationDialog rangeId={range["id"]}/>*/}
							</div>
						</div>
					</CardMobile>
				</div>
			));
		}
		return message;
	}

	hasMore = () => {
		let ret = true;
		if (this.state.rangesHistoryCount) {
			if (
				this.state.rangesHistoryCount <= this.state.rangesHistory.length
			) {
				ret = false;
			}
		}
		return ret;
		// useHasMore(this.state.rangesHistoryCount, this.state.rangesHistory);
	};

	render() {
		return (
			<div className="container-fluid">
				<div className={"d-flex flex-column "}>
					<CardBasicTitle title={"Detection config"}>
						<div className={"d-flex flex-column"}>
							<p className={"mt-2 mb-2"}>Create a range name</p>
							{this.manualTagInput()}
							<p className={"mt-2 mb-2"}>Select a time range</p>
							<CardMobile>
								<div className={"m-2"}>
									<label htmlFor="from">From : </label>
									<input
										id="from"
										type="time"
										name="from"
										onChange={this.setFrom}
									/>
									<label htmlFor="to">To : </label>
									<input
										id="to"
										type="time"
										name="to"
										onChange={this.setTo}
									/>
								</div>
								<div>{this.setDaysCheckboxes()}</div>
								<div>Default: every day</div>
							</CardMobile>
							{this.showBasicConfirmButton()}
							{this.activationResults()}
						</div>
					</CardBasicTitle>
					<InfiniteScroll
						dataLength={this.state.rangesHistory.length}
						next={this.basicConfirmButtonClick}
						hasMore={this.hasMore()}
						loader={<p>Loading...</p>}
					>
						{this.showCreatedRange()}
					</InfiniteScroll>
					<div className={"m-4"}></div>
				</div>
			</div>
		);
	}
}

export default TagDetection;
