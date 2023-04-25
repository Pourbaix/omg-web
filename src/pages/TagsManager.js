import React, { Component } from "react";
import Calendar from "react-calendar";
import {
	getAllTagsFromUserId,
	getTagsDay,
	getTagsDays,
	getAllTagsWithoutData,
	deleteOneTag,
} from "../services/omgServer";
import CardMobile from "../components/Cards/CardMobile";
import EditTagActivationDialog from "../components/Dialogs/EditTagActivationDialog";
import DeleteTagActivationDialog from "../components/Dialogs/DeleteTagActivationDialog";
import DeleteTagDialog from "../components/Dialogs/DeleteTagDialog";
import EditTagNameDialog from "../components/Dialogs/EditTagNameDialog";
import CardBasicTitle from "../components/Cards/CardBasicTitle";

class TagsManager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tagNames: [],
			selectedTagName: "",
			loadingTags: true,
			dataDays: [],
			selectedDay: "",
			tagsDay: [],
			toggleView: "viewByDay",
			tagWithoutData: [],
		};
	}

	selectedTagNameChange = (event) => {
		this.setState({ selectedTagName: event.target.value });
	};

	selectedDayChange = (event) => {
		this.setState({ selectedDay: event });
	};

	refreshTagsDay = () => {
		this.setState({ tagsDay: [] });
		getTagsDay(
			this.state.selectedDay.toISOString(),
			this.state.selectedTagName === "All"
				? ""
				: this.state.selectedTagName
		).then((res) => {
			this.setState({ tagsDay: res });
		});
	};

	refreshDataDays = () => {
		this.setState({ dataDays: [] });
		getTagsDays(
			this.state.selectedTagName === "All"
				? ""
				: this.state.selectedTagName
		).then((res) => {
			res = res.map((date) => new Date(date));
			res.forEach((date) => date.setHours(0, 0, 0, 0));
			this.setState({ dataDays: res.map((date) => date.toISOString()) });
		});
	};

	refreshTagsWithNoData = () => {
		this.setState({ tagWithoutData: [] });
		getAllTagsWithoutData().then((res) => {
			console.log(res);
			this.setState({ tagWithoutData: res });
		});
	};

	deleteTag = (tagId, index) => {
		this.state.tagWithoutData.splice(index, 1);
		deleteOneTag(tagId);
		this.refreshTagsWithNoData();
	};

	componentDidMount() {
		getAllTagsFromUserId().then((res) => {
			res.unshift("All");
			this.setState({ tagNames: res });
			this.setState({ loadingTags: false });
			this.setState({ selectedTagName: "All" });
		});
		this.refreshTagsWithNoData();
		this.refreshDataDays();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.selectedTagName !== prevState.selectedTagName) {
			this.refreshDataDays();
			if (this.state.selectedDay) {
				this.refreshTagsDay();
			}
		}
		if (this.state.selectedDay !== prevState.selectedDay) {
			this.refreshTagsDay();
		}
	}

	setTagNamesSelector() {
		let selector = <div />;
		if (this.state.loadingTags) {
			selector = (
				<div>
					<label
						className={"form-check-label"}
						htmlFor={"chooseTagsManager"}
					>
						Choose a tag
					</label>
					<select
						id={"chooseTagsManager"}
						className={"form-control mb-3"}
						defaultValue={"none"}
					>
						<option
							id={"selectedOptionRevertImportSelector"}
							value={"none"}
						>
							Loading...
						</option>
					</select>
				</div>
			);
		} else {
			selector = (
				<div>
					<select
						id={"chooseTagsManager"}
						className={"form-control mb-3"}
						onChange={this.selectedTagNameChange}
						defaultValue={"All"}
					>
						{this.state.tagNames.map((tag) => (
							<option key={tag} value={tag}>
								{tag}
							</option>
						))}
					</select>
				</div>
			);
		}
		return selector;
	}

	setCalendar() {
		return (
			<div className={"mb-4 d-flex flex-column align-items-center"}>
				<label className={"form-check-label fw-bold"}>
					Select a day to see all related tags{" "}
				</label>
				<Calendar
					onChange={this.selectedDayChange}
					tileClassName={({ date, view }) => {
						return view === "month" &&
							this.state.dataDays.includes(date.toISOString())
							? "text-success"
							: "text-danger";
					}}
				/>
			</div>
		);
	}

	setEditActivationsByDay() {
		if (this.state.selectedDay) {
			if (this.state.tagsDay.length > 0) {
				return (
					<div
						className={
							"mb-4 d-flex flex-column justify-content-center"
						}
					>
						<div
							className={
								"d-flex w-100 align-content-center justify-content-center"
							}
						>
							<div className={"h5"}>
								{this.state.selectedDay.toLocaleDateString([], {
									weekday: "short",
									day: "2-digit",
									month: "short",
									year: "numeric",
								})}
							</div>
						</div>
						{this.state.tagsDay.map((tag) => (
							<div key={"containerTagsManagerCard" + tag["id"]}>
								<CardMobile>
									{/* <!-- Card Header - Accordion --> */}
									<a
										href={"#tagCard" + tag["id"]}
										className="card-header collapsed"
										data-bs-toggle="collapse"
										role="button"
										aria-expanded="true"
										aria-controls={"tagCard" + tag["id"]}
									>
										<div
											className={
												"d-flex justify-content-between"
											}
										>
											<div
												className={
													"fw-bold text-lg text-primary"
												}
											>
												{tag["name"]}
											</div>
											<div
												className={
													"text-lg text-gray-700"
												}
											>
												{new Date(
													tag["startDatetime"]
												).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										</div>
									</a>
									{/*<!-- Card Content - Collapse -->*/}
									<div
										className="collapse"
										id={"tagCard" + tag["id"]}
									>
										<div className="card-body d-flex justify-content-around">
											<EditTagActivationDialog
												tagName={tag["name"]}
												tagDatetime={
													tag["startDatetime"]
												}
												tagId={tag["id"]}
											/>
											<DeleteTagActivationDialog
												tagId={tag["id"]}
											/>
										</div>
									</div>
								</CardMobile>
							</div>
						))}
					</div>
				);
			} else {
				return (
					<div className={"mb-4 text-center"}>
						No tag created this day
					</div>
				);
			}
		}
	}

	setEditTag(selectedTagName) {
		return (
			<div
				className={
					"mb-4 d-flex flex-column align-items-center justify-content-center"
				}
			>
				{this.state.selectedTagName === "All" ? (
					<div />
				) : (
					<div className={"d-flex justify-content-center mb-3"}>
						<EditTagNameDialog tagName={selectedTagName} />
					</div>
				)}

				<div className={"d-flex justify-content-center"}>
					<DeleteTagDialog tagName={selectedTagName} />
				</div>
			</div>
		);
	}

	setTagWithNoData() {
		return (
			<CardBasicTitle color={"warning"} title={"Unused Tags"}>
				{/* <p className={"text-danger text-center"}>
					Warning ! These operations are irreversible
				</p> */}
				<p className={"fw-bold text-black"}>
					These tags are not associated with any data:
				</p>
				<div
					className="d-flex align-items-center flex-column gap-1"
					style={{ maxHeight: "60vh", overflowY: "auto" }}
				>
					{this.state.tagWithoutData.length ? (
						this.state.tagWithoutData.map((elem) => (
							<div
								className="px-2 py-1 w-100 border border-2 d-flex justify-content-between align-items-center"
								style={{ borderRadius: "3px" }}
								key={elem.id}
							>
								<div className="d-flex flex-column">
									<p className="m-0 fw-bold">{elem.name}</p>
									<p className="m-0">
										{new Date(
											elem.startDatetime
										).toLocaleString()}
									</p>
								</div>
								<p
									className="m-0 me-3 ms-3 fs-5 fw-bold text-danger"
									style={{ cursor: "pointer" }}
									onClick={() => {
										this.deleteTag(
											elem.id,
											this.state.tagWithoutData.indexOf(
												elem
											)
										);
									}}
								>
									X
								</p>
							</div>
						))
					) : (
						<p>No tags detected</p>
					)}
				</div>
			</CardBasicTitle>
		);
	}

	render() {
		return (
			<div className={"d-flex flex-row align-items-start ps-4"}>
				<CardBasicTitle title={"Choose a tag"}>
					<div
						className={"d-flex flex-column"}
						style={{ width: "100%" }}
					>
						{this.setTagNamesSelector()}
						{this.setCalendar()}
						{this.setEditActivationsByDay()}
						{this.state.selectedTagName ? (
							this.setEditTag(this.state.selectedTagName)
						) : (
							<div />
						)}
					</div>
				</CardBasicTitle>
				{this.setTagWithNoData()}
			</div>
		);
	}
}

export default TagsManager;
