import React, { Component } from "react";
import CardBasicTitle from "../Cards/CardBasicTitle";
import {
	getAllTagsFromUserId,
	getRecentTags,
	postBasicTag,
} from "../../services/omgServer";
import TextField from "@mui/material/TextField";
import { useRoundMinutesAndAddSummerTime } from "../../hooks/useRoundMinutesAndAddSummerTime";
import { useToIsoString } from "../../hooks/useToIsoString";
import autoComplete from "@tarekraafat/autocomplete.js";
import { get } from "jquery";
import "../../styles/scss/components/activateBasicTag/activateBasicTag.scss";

/**
 * This class represents a card with 4 sections :
 * 1. recent tags will display the 8 most recent tag names
 * 2. manual will get a new tag name
 * 3. datetime will get the new event datetime
 * 4. button will send the tag name and datetime
 */
class ActivateBasicTag extends Component {
	/**
	 * recentTags will contain all the tag names
	 * roundedDatetime will contain the rounded datetime to send to the DB.
	 * chosenDatetime will contain the datetime to display to the user.
	 * chosenTag will be the tag name to send to the DB.
	 * status will contain a number
	 * (-1 = error, 0 = nothing, 1 = loading, 2 = success)
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			recentTags: [],
			allTags: [],
			roundedDatetime: this.getDatePickerFormat(new Date(Date.now())),
			chosenDatetime: this.getDatePickerBeforeRound(new Date(Date.now())),
			chosenTag: "",
			status: "",
		};
	}

	/**
	 * At the end of the page loading, state.recentTags
	 * is filled with the 8 most recent tags.
	 * getRecentTags is imported from omgServer.js which will fetch data
	 * with '/recent' url. The url is used by routeTag with ctrTag.getRecentTagsFromUserId
	 * (ctrTag is where the orm will make the DB request)
	 */
	componentDidMount() {
		getRecentTags().then((res) => {
			if (res) {
				this.setState({ recentTags: res });
				// console.log(this.getDatePickerFormat(new Date(Date.now())));
			} else {
				// console.log(res);
			}
		});
		getAllTagsFromUserId().then((res) => {
			if (res) {
				this.setState({ allTags: res });
				const autoCompleteJS = new autoComplete({
					selector: "#manualBasicTagInput",
					placeHolder: "Enter a tag name",
					data: { src: res },
					resultItem: {
						highlight: true,
						tag: "p",
						class: "search_item text-primary",
						element: (item, data) => {
							// console.log(item);
							item.setAttribute(
								"onclick",
								'document.getElementById("manualBasicTagInput").value = ' +
									'"' +
									item.innerText +
									'"'
							);
						},
					},
					resultsList: {
						class: "position-fixed bg-white border border-primary border-3 p-2 search_container ",
						tabSelect: true,
						// element: (list, data) => {
						// 	console.log(list, data);
						// 	data.results.forEach((element) => {
						// 		console.log(element.match);
						// 	});
						// },
					},
					threshold: 1,
					wrapper: true,
				});
			}
		});
	}

	clickSearchElement = (element) => {
		// console.log(element);
	};

	// componentDidUpdate(prevProps, prevState, snapshot) {
	//     if (this.state.chosenTag !== prevState.chosenTag) {
	//         console.log(this.state.chosenTag);
	//     }
	// }
	/**
	 * Called in showDatetime when the value changes.
	 * Set roundedDatetime to get the data rounded to be sent to the DB.
	 * Set chosenDatetime to display the datetime chosen
	 * (and avoid 00, 05, 50, 55 to be the only minutes we can enter)
	 * set state.status to "activate tag" (0)
	 * @param event
	 */
	chosenDatetimeChange = (event) => {
		this.setState({
			roundedDatetime: this.getDatePickerFormat(
				new Date(event.target.value)
			),
		});
		this.setState({
			chosenDatetime: this.getDatePickerBeforeRound(
				new Date(event.target.value)
			),
		});
		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	};
	/**
	 * Called in showRecentTags on a tag click.
	 * It set the manual input value to the chosen tag name (and display it).
	 * It set the state.chosenTag (data to be post with the datetime) and
	 * set state.status to "activate tag" (0)
	 * @param event
	 */
	recentTagClick = (event) => {
		let manualTagInput = document.getElementById("manualBasicTagInput");
		manualTagInput.value = event.target.value;
		this.setState({ chosenTag: event.target.value });
		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	};
	/**
	 * Called when manualTag input value changes
	 * (only by manual input not by clicking on a tag name).
	 * It gets the checked radio button (if there is) and removes the class.
	 * It sets state.chosenTag with the user input and
	 * set state.status to "activate tag" (0)
	 * @param event
	 */
	manualBasicTagInputChange = (event) => {
		let radio = document.querySelector(
			'input[type="radio"][name="recentTagsButtons"]:checked'
		);
		if (radio) {
			radio.checked = false;
			document
				.getElementById("recentTagsLbl" + radio.id.substr(13))
				.classList.remove("active");
		}
		this.setState({ chosenTag: event.target.value });

		if (this.state.status !== 0) {
			this.setState({ status: 0 });
		}
	};
	/**
	 * Called in showBasicConfirmButton.
	 * If the manualTag input is not empty,
	 * it'll set the status to "loading",
	 * then convert the rounded datetime to
	 * a readable format for the DB.
	 * postBasicTag (omgServer.js) with url '/one',
	 * (body : endDatetime useless ?),
	 * routeTag post ctrTag.postOne
	 * Then set state.status to "success" (2) or "error" (-1)
	 * ------
	 * EDIT: roundedDatetime = current GMT (+1 OR +2)
	 * toISOString = GMT 0
	 */
	basicConfirmButtonClick = () => {
		if (this.state.chosenTag) {
			this.setState({ status: 1 });
			let chosenDatatimeISO = new Date(
				this.state.roundedDatetime
			).toISOString();
			// let chosenDatatimeISO = useToIsoString(new Date(this.state.roundedDatetime));
			postBasicTag(this.state.chosenTag, chosenDatatimeISO).then(
				(res) => {
					if (res) {
						this.setState({ status: 2 });
					} else {
						this.setState({ status: -1 });
					}
				}
			);
		} else {
			document.getElementById("basicConfirmButtonInvalidText").innerText =
				"You have to select/enter a tag";
		}
	};

	/**
	 * manages the display of the status of the tag activation (basic confirm button).
	 * Called when state.status changes, it will update the element above
	 * the button (showBasicConfirmButton) or the button text (changeBasicConfirmButtonStatus).
	 * state.status can be set in chosenDatetimeChange (0), recentTagClick (0),
	 * manualBasicTagInputChange (0) and basicConfirmButtonClick (1 then 2 or -1)
	 * @return {JSX.Element}
	 */
	activationResults() {
		let basicBtn = document.getElementById("basicConfirmButton");
		if (this.state.status === -1) {
			this.changeBasicConfirmButtonStatus("btn-danger", "error");
			document.getElementById("uploadButtonInvalidText").innerText =
				this.state.resultRequest;
		}
		if (this.state.status === 0) {
			this.changeBasicConfirmButtonStatus("btn-primary", "Create tag");
			basicBtn.removeAttribute("disabled");
			document.getElementById("basicConfirmButtonInvalidText").innerText =
				"";
		}
		if (this.state.status === 1) {
			this.changeBasicConfirmButtonStatus("btn-primary", "activating...");
		}
		if (this.state.status === 2) {
			this.changeBasicConfirmButtonStatus("btn-success", "tag created !");
		}
	}

	/**
	 * Visual change of basic confirm button.
	 * Called only in activationResults.
	 * It takes the HTML element, removes the class if..
	 * then set the button attribute to disabled,
	 * the button class with the newBtnColor param
	 * and the button text with the btnText param
	 * @param newBtnColor
	 * @param btnText
	 */
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

	/**
	 * The 8 most recent tags are shown by default.
	 * This will show 8 more tags each time it is called.
	 */
	loadMoreSuggestion = () => {
		this.setState({ recentTags: this.state.allTags });
	};

	/**
	 * Displays recent tags.
	 * Each tag name will be displayed in a radio input
	 * (only one can be selected, name is the same for each input
	 * in order to be treated as a group (deselect when one is selected)).
	 * Label is important for accessibility.
	 * recentTagClick will set the input value
	 * and set state.chosenTag to the name of the tag.
	 * @return {JSX.Element}
	 */
	showRecentTags() {
		if (this.state.recentTags.length > 0) {
			return (
				<div className={"d-flex mt-2 flex-column"}>
					<p className={"mb-0 text-uppercase"}>Recent tags</p>
					<div
						className={"d-inline-flex flex-wrap btn-group-toggle"}
						data-bs-toggle={"buttons"}
					>
						{this.state.recentTags.map((tag) => (
							<label
								id={
									"recentTagsLbl" +
									this.state.recentTags.indexOf(tag)
								}
								key={
									"recentTagsLbl" +
									this.state.recentTags.indexOf(tag)
								}
								className={
									"btn btn-outline-primary mt-2 ms-1 me-1 ps-2 pe-2 pt-1 pb-1"
								}
							>
								<input
									type="radio"
									name="recentTagsButtons"
									key={
										"recentTagsBtn" +
										this.state.recentTags.indexOf(tag)
									}
									id={
										"recentTagsBtn" +
										this.state.recentTags.indexOf(tag)
									}
									value={tag}
									onClick={this.recentTagClick}
									style={{ opacity: 0, position: "fixed" }}
								/>
								{tag}
							</label>
						))}
					</div>
					<button
						className="btn btn-primary align-self-center mt-2"
						onClick={this.loadMoreSuggestion}
					>
						<span className="text">Display all</span>
					</button>
				</div>
			);
		} else {
			return <p>No tag previously created.</p>;
		}
	}

	/**
	 * This input needs a string, entered manually or by clicking
	 * on the recent tags showed above.
	 * When the value changes, state.chosenTag is set with the string
	 * @returns {JSX.Element}
	 */
	manualTag() {
		return (
			<div
				className={"mt-3"}
				style={{ clipPath: "inset(0, auto, auto, 0)" }}
			>
				<p className={"mb-2 text-uppercase"}>Manual</p>
				<input
					id={"manualBasicTagInput"}
					className={
						"form-control form-control-plaintext border ps-2 border-bottom-primary search_field"
					}
					placeholder={"Enter a tag"}
					onChange={this.manualBasicTagInputChange}
					style={{ width: "50vw" }}
				/>
			</div>
		);
	}

	/**
	 * The initial value is now (datetime).
	 * onChange is called when the value changes (with a manual input or the calendar)
	 * and sets the value to the chosen datetime.
	 * The TextField is type "datetime-local" which is supported by most browser
	 * but not well implemented (firefox and safari). That leads to be forced to
	 * enter a time manually because the time picker is not showing.
	 * https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input/datetime-local#g%C3%A9rer_la_prise_en_charge_des_navigateurs
	 * Knowing that, the data displayed and sent are set separately to avoid inconsistency.
	 * @returns {JSX.Element}
	 */
	showDatetime() {
		return (
			<div className={"mt-3 d-flex flex-column"}>
				<p className={"mb-1 text-uppercase"}>Datetime</p>
				<TextField
					value={this.state.chosenDatetime}
					onChange={this.chosenDatetimeChange}
					id="datetimePickerBasicTag"
					type="datetime-local"
					className={"w-100 rounded"}
				/>
			</div>
		);
	}

	/**
	 * It returns the date rounded the nearest multiple of 5.
	 * Only used in getDatePickerFormat
	 * @param date
	 * @returns {Date}
	 */
	roundTo5Minutes(date) {
		let coeff = 1000 * 60 * 5;
		return new Date(Math.round(date.getTime() / coeff) * coeff);
	}

	/**
	 * Used to set the initial value and
	 * the updated value (onchange) of state.chosenDatetime.
	 * The rest is the same as getDatePickerFormat.
	 * @param date
	 * @returns {string}
	 */
	getDatePickerBeforeRound(date) {
		let initDate = date;
		initDate.setUTCHours(
			initDate.getUTCHours() - initDate.getTimezoneOffset() / 60
		);
		return initDate.toISOString().substr(0, 16);
	}

	/**
	 * date is either now or the chosen datetime (event.target.value).
	 * Used to set the initial value and
	 * the updated value (onchange) of state.roundedDatetime.
	 * It will round the date to the nearest multiple of 5.
	 * It will add the timezone offset (GMT+1 OR +2 after april) to have the local hour.
	 * It converts it into iso format and removes the zeros at end.
	 * @param date
	 * @returns {string}
	 */
	getDatePickerFormat(date) {
		// let initDate = useRoundMinutesAndAddSummerTime(date, 1);
		let initDate = this.roundTo5Minutes(date);
		initDate.setUTCHours(
			initDate.getUTCHours() - initDate.getTimezoneOffset() / 60
		);
		return initDate.toISOString().substr(0, 16);
	}

	/**
	 * Contains a div where requirement error will be displayed
	 * and a button which will trigger an api call.
	 * @returns {JSX.Element}
	 */
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
						Create tag
					</span>
				</button>
			</div>
		);
	}

	/**
	 * CardBasicTitle wrap content with a "card" style and set the title.
	 * "d-flex flex-column" means display flex and put elements vertically.
	 * showRecentTags gives a set of the recent tags to fill the input below.
	 * manualTag is an input waiting for either a recent tag or a new one (string).
	 * showDatetime is also an input waiting for a datetime (date should be picked with the calendar).
	 * showBasicConfirmButton button which will trigger the post call with tag name and datetime.
	 * activationResults is a space where the result of the button click will be displayed.
	 * @returns {JSX.Element}
	 */
	render() {
		return (
			<CardBasicTitle title={"Create a tag"}>
				<div className={"d-flex flex-column"}>
					{this.showRecentTags()}
					{this.manualTag()}
					{this.showDatetime()}
					{this.showBasicConfirmButton()}
					{this.activationResults()}
				</div>
			</CardBasicTitle>
		);
	}
}

export default ActivateBasicTag;
