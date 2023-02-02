import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { putOneTag, putOneRange } from "../../services/omgServer";
import CardMobile from "../Cards/CardMobile";
import { useNumberToArrayDayNameNumber } from "../../hooks/useNumberToArrayDayNameNumber";
import { useRoundMinutesAndAddSummerTime } from "../../hooks/useRoundMinutesAndAddSummerTime";

export default function EditTagActivationDialog(props) {
	const roundTo5Minutes = (date) => {
		let coeff = 1000 * 60 * 5;
		return new Date(Math.round(date.getTime() / coeff) * coeff);
	};

	const getDatePickerFormat = (date) => {
		// let initDate = useRoundMinutesAndAddSummerTime(date, -1);
		let initDate = roundTo5Minutes(date);
		initDate.setUTCHours(
			initDate.getUTCHours() - initDate.getTimezoneOffset() / 60
		);
		return initDate.toISOString().substr(0, 16);
	};

	const [open, setOpen] = React.useState(false);
	const [tagName, setTagName] = useState(props.tagName);
	const [tagDatetime, setTagDatetime] = useState(
		getDatePickerFormat(new Date(props.tagDatetime))
	);
	const [tagId] = useState(props.tagId);
	const [rangeName, setRangeName] = useState(props.rangeName);
	const [rangeFrom, setRangeFrom] = useState(props.rangeFrom);
	const [rangeTo, setRangeTo] = useState(props.rangeTo);
	const [rangeDaysSelected, setRangeDaysSelected] = useState(
		props.rangeDaysSelected
	);
	const [rangeId] = useState(props.rangeId);

	const editTagActivationNameInputChange = (event) => {
		setTagName(event.target.value);
	};

	const editRangeActivationNameInputChange = (event) => {
		setRangeName(event.target.value);
	};

	const editRangeFromInputChange = (event) => {
		setRangeFrom(event.target.value);
	};

	const editRangeToInputChange = (event) => {
		setRangeTo(event.target.value);
	};

	const editRangeDaysSelectedInputChange = (event) => {};

	const editTagActivationDatetimeChange = (event) => {
		setTagDatetime(getDatePickerFormat(new Date(event.target.value)));
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		document.getElementById("editTagActivationResultRequestTag").innerText =
			"";
		refreshPage();
	};

	const applyChanges = () => {
		if (tagId) {
			console.log(
				tagName +
					"  " +
					tagId +
					"\n Date to display: " +
					new Date(tagDatetime)
			);
			console.log("Date to DB: " + new Date(tagDatetime).toISOString());
			putOneTag(tagName, tagId, new Date(tagDatetime).toISOString()).then(
				(res) => {
					document.getElementById(
						"editTagActivationResultRequestTag"
					).innerText = res;
				}
			);
		}
		if (rangeId) {
			putOneRange(
				rangeName,
				rangeFrom,
				rangeTo,
				rangeDaysSelected,
				rangeId
			).then((res) => {
				document.getElementById(
					"editTagActivationResultRequestTag"
				).innerText = res;
			});
		}
	};

	const refreshPage = () => {
		window.location.reload(false);
	};

	const weekDaysChange = (event) => {
		// console.log(rangeFrom);
		// let day = event.target.value;
		// console.log(event.target.checked);
		let everyDay = 127;
		const currentDays = parseInt(rangeDaysSelected);
		if (event.target.checked) {
			const dayToAdd = parseInt(event.target.value);
			setRangeDaysSelected(currentDays + dayToAdd);
			console.log(currentDays + dayToAdd);
		} else {
			const dayToSub = parseInt(event.target.value);
			setRangeDaysSelected(currentDays - dayToSub);
			console.log(currentDays - dayToSub);
		}
	};

	const setDaysCheckboxes = () => {
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
		// console.log(rangeDaysSelected);
		//trad dec->bin
		// let daysNumbers = [];
		// let bitDays = rangeDaysSelected.toString(2);
		// let j = 0;
		// for (let i = bitDays.length; i > 0; i--) {
		//     // console.log(bitDays[i-1]);
		//     if (bitDays[i - 1] == "1") {
		//         daysNumbers.push(j);
		//     }
		//     j++;
		// }
		const daysNumbers = useNumberToArrayDayNameNumber(rangeDaysSelected);
		// console.log(daysNumbers);
		weekDays.forEach((day, i) => {
			let checked = daysNumbers.includes(i);
			// console.log(checked);
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
						onChange={weekDaysChange}
						defaultChecked={checked}
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
	};

	if (tagId) {
		return (
			<div>
				<button
					type={"button"}
					className={"btn btn-warning"}
					onClick={handleClickOpen}
				>
					<span className={"icon text-white me-2"}>
						<i className={"fas fa-edit"} />
					</span>
					<span className={"text"}>Edit & Confirm</span>
				</button>
				{/*<button className={"btn btn-warning"} onClick={handleClickOpen}>*/}
				{/*    Edit*/}
				{/*</button>*/}
				<Dialog
					open={open}
					onClose={handleClose}
					// aria-labelledby="editTagActivation-dialog-title"
				>
					<DialogTitle
						id="editTagActivationDialogTitle"
						className={"text-warning pb-0"}
					>
						Edit Tag
					</DialogTitle>
					<DialogContent className={"ms-2 me-2"}>
						<div className="row form-group mt-2">
							<label
								className={"form-check-label"}
								htmlFor="editTagActivationNameInput"
							>
								Name
							</label>
							<input
								type="text"
								className={"form-control"}
								id="editTagActivationNameInput"
								value={tagName}
								onChange={editTagActivationNameInputChange}
							/>
							<div className={"invalid-feedback"}>
								You have to enter a tag name
							</div>
						</div>
						<div className="row form-group mt-2">
							<label
								className={"form-check-label"}
								htmlFor="editTagActivationDatetime"
							>
								Activation datetime
							</label>
							<TextField
								value={tagDatetime}
								onChange={editTagActivationDatetimeChange}
								id="editTagActivationDatetime"
								type="datetime-local"
								className={"w-100 rounded"}
							/>
						</div>
						<div className="d-flex row form-group mt-2">
							<div
								id={"editTagActivationResultRequestTag"}
								className={"text-center text-info"}
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<button
							id={"editTagActivationApplyButton"}
							onClick={applyChanges}
							className={"btn text-warning ms-0"}
						>
							Apply
						</button>
						<button
							onClick={handleClose}
							className={"btn text-primary"}
						>
							Close
						</button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}

	if (rangeId) {
		console.log(rangeDaysSelected);
		return (
			<div>
				<button
					type={"button"}
					className={"btn btn-warning"}
					onClick={handleClickOpen}
				>
					<span className={"icon text-white me-2"}>
						<i className={"fas fa-edit"} />
					</span>
					<span className={"text"}>Edit & Confirm</span>
				</button>
				{/*<button className={"btn btn-warning"} onClick={handleClickOpen}>*/}
				{/*    Edit*/}
				{/*</button>*/}
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="editTagActivation-dialog-title"
				>
					<DialogTitle
						id="editTagActivationDialogTitle"
						className={"text-warning pb-0"}
					>
						Edit Range
					</DialogTitle>
					<DialogContent className={"ms-2 me-2"}>
						<div className="row form-group mt-2">
							<label
								className={"form-check-label"}
								htmlFor="editTagActivationNameInput"
							>
								Name
							</label>
							<input
								type="text"
								className={"form-control"}
								id="editTagActivationNameInput"
								value={rangeName}
								onChange={editRangeActivationNameInputChange}
							/>
							<div className={"invalid-feedback"}>
								You have to enter a tag name
							</div>
						</div>
						<div className="row form-group mt-2">
							<CardMobile>
								<div className={"m-2"}>
									<label htmlFor="from">From : </label>
									<input
										id="from"
										type="time"
										name="from"
										value={rangeFrom}
										onChange={editRangeFromInputChange}
									/>
									<label htmlFor="to">To : </label>
									<input
										id="to"
										type="time"
										name="to"
										value={rangeTo}
										onChange={editRangeToInputChange}
									/>
								</div>
								<div>{setDaysCheckboxes()}</div>
								<div>Default: every day</div>
							</CardMobile>
						</div>
						<div className="d-flex row form-group mt-2">
							<div
								id={"editTagActivationResultRequestTag"}
								className={"text-center text-info"}
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<button
							id={"editTagActivationApplyButton"}
							onClick={applyChanges}
							className={"btn text-warning ms-0"}
						>
							Apply
						</button>
						<button
							onClick={handleClose}
							className={"btn text-primary"}
						>
							Close
						</button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
