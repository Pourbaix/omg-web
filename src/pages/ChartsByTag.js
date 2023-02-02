import React, { Component } from "react";
import { getAllTagsFromUserId } from "../services/omgServer";
import ChartBasic from "../components/Charts/Line/ChartBasic";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import CardBasicTitle from "../components/Cards/CardBasicTitle";
import { useDayToAddDayInArray } from "../hooks/useDayToAddDayInArray";

/**
 * "web page" ChartsByTag. Displays a graph according to the chosen tag
 */
class ChartsByTag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [], // stores user tags for displaying
			tagSelected: "Choose a tag...", // stores the chosen tag
			loadingTags: true,
			dtrp: null,
			fromTime: -1,
			toTime: 3,
			weekDaysSelected: [],
		};
	}

	/**
	 * get the user's tags when loading the component
	 */
	componentDidMount() {
		getAllTagsFromUserId().then((data) => {
			try {
				data.unshift("Choose a tag...");
				this.setState({ tags: data });
				this.setState({ loadingTags: false });
			} catch (e) {
				console.log("error while try to retrieve tags : " + e);
			}
		});
	}

	tagChange = (event) => {
		this.setState({ tagSelected: event.target.value });
	};

	fromTimeChange = (event) => {
		this.setState({ fromTime: event.target.value });
	};

	toTimeChange = (event) => {
		this.setState({ toTime: event.target.value });
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
	}

	/**
	 * This function loads user's tags in the selector and returns it
	 * @return {JSX.Element}
	 */
	tagSelector() {
		if (!this.state.loadingTags) {
			return (
				<form>
					<label htmlFor="tagsList" hidden={true}>
						Choose a tag :
					</label>
					<select
						className="form-control mt-4"
						id="tagsList"
						onChange={this.tagChange}
						defaultValue={{ value: "Choose a tag..." }}
					>
						{this.state.tags.map((tag) => (
							<option key={tag} value={tag}>
								{tag}
							</option>
						))}
					</select>
				</form>
			);
		} else {
			return <p>Loading...</p>;
		}
	}

	setTimeSelector(begin, end, defaultValue, state) {
		let options = [];
		if (end > begin) {
			for (let i = begin; i <= end; i++) {
				options.push(
					<option key={"optionSelector" + i} value={i}>
						{i}
					</option>
				);
			}
		} else if (begin > end) {
			for (let i = begin; i >= end; i--) {
				options.push(
					<option key={"optionSelector" + i} value={i}>
						{i}
					</option>
				);
			}
		}
		let selector = <p>error</p>;
		if (state === "from") {
			selector = (
				<select
					className={"form-control w-auto"}
					defaultValue={defaultValue}
					onChange={this.fromTimeChange}
				>
					{options}
				</select>
			);
		} else if (state === "to") {
			selector = (
				<select
					className={"form-control w-auto"}
					defaultValue={defaultValue}
					onChange={this.toTimeChange}
				>
					{options}
				</select>
			);
		}
		return selector;
	}

	setDaysCheckboxes() {
		let weekDays = [
			["Mon", 1],
			["Tue", 2],
			["Wed", 3],
			["Thu", 4],
			["Fri", 5],
			["Sat", 6],
			["Sun", 0],
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

	/**
	 * Displays the chart as soon as a tag has been selected
	 *
	 * @return {JSX.Element}
	 */
	renderChart() {
		if (this.state.tagSelected === "Choose a tag...") {
			return <div />;
		} else {
			return (
				<CardBasicTitle title={"Chart"} color={"primary"}>
					<ChartBasic
						tagSelected={this.state.tagSelected}
						datetimeRange={this.state.dtrp}
						timeSelected={[this.state.fromTime, this.state.toTime]}
						weekDaysSelected={this.state.weekDaysSelected}
					/>
				</CardBasicTitle>
			);
		}
	}

	// componentDidUpdate(prevProps, prevState, snapshot) {
	//     if (this.state.weekDaysSelected !== prevState.weekDaysSelected) {
	//         console.log(this.state.weekDaysSelected);
	//     }
	// }

	render() {
		return (
			<div className="container-fluid ms-3 me-1">
				<div className="d-flex">
					<CardBasicTitle title={"tag"} color={"primary"}>
						<p className={"text-center small"} />
						<div className="d-flex align-items-center mb-4 ms-4 me-4">
							{this.tagSelector()}
						</div>
					</CardBasicTitle>
					<CardBasicTitle title={"Chart time range"}>
						<p className={"text-center small"}>
							Default : from -1h to +3h
						</p>
						<div className="align-items-center d-flex">
							<p className={"mb-0 me-2 w-auto"}>From :</p>
							{this.setTimeSelector(-1, -12, -1, "from")}
							<p className={"mb-0 ms-4 me-2 w-auto"}>To :</p>
							{this.setTimeSelector(1, 12, 3, "to")}
						</div>
					</CardBasicTitle>
					<CardBasicTitle title={"Dates and week days"}>
						<p className={"text-center small"}>
							Default : all tags are displayed
						</p>
						<div className="d-flex align-items-center flex-column justify-content-center">
							<DateTimeRangePicker
								onChange={(value) =>
									this.setState({ dtrp: value })
								}
								value={this.state.dtrp}
							/>
							<hr className="sidebar-divider mb-1" />
							<div>{this.setDaysCheckboxes()}</div>
						</div>
					</CardBasicTitle>
				</div>
				<div className="row">
					<div className={"col-12"}>{this.renderChart()}</div>
				</div>
			</div>
		);
	}
}

export default ChartsByTag;
