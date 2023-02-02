import React, { Component } from "react";
import {
	getPendingTags,
	getTagsHistory,
	getTagsHistoryByActivationTime,
	putOneTag,
} from "../services/omgServer";
import CardMobile from "../components/Cards/CardMobile";
import { useFormatStringForId } from "../hooks/useFormatStringForId";
import EditTagActivationDialog from "../components/Dialogs/EditTagActivationDialog";
import DeleteTagActivationDialog from "../components/Dialogs/DeleteTagActivationDialog";
import CardExample from "../components/Cards/CardExample";
import ConfirmEachButton from "../components/TagActivation/ConfirmEachButton";
import { Navigate } from "react-router-dom";

class PendingTags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pendingTags: "",
			redirect: false,
		};
	}

	componentDidMount() {
		getPendingTags().then((pendingTags) => {
			this.setState({ pendingTags: pendingTags });
			console.log(this.state.pendingTags);
		});
	}

	clickConfirmAll = () => {
		if (this.state.pendingTags) {
			let i = 0;
			let pendingTagsLength = this.state.pendingTags.length;
			this.state.pendingTags.map((pendingTag) =>
				putOneTag(
					pendingTag.name,
					pendingTag.id,
					new Date(pendingTag.startDatetime).toISOString()
				).then((res) => {
					console.log("my res: " + res);
					i++;
					if (i === pendingTagsLength) {
						this.setState({ redirect: true });
					}
				})
			);
			// window.location.reload(true);
		}
	};

	showConfirmAllButton() {
		if (this.state.pendingTags.length > 0) {
			return (
				<div className="align-self-center d-flex flex-column">
					{/*<div id={"basicConfirmButtonInvalidText"} className={"text-danger mb-2 align-self-center"}/>*/}
					<button
						id={"ConfirmAllButton"}
						className="btn btn-primary align-self-center mb-2"
						onClick={this.clickConfirmAll}
					>
						<span id={"ConfirmAllButtonText"} className="text">
							Confirm All
						</span>
					</button>
				</div>
			);
		}
	}

	showConfirmEachButton() {
		return (
			<div className="align-self-center d-flex flex-column">
				{/*<div id={"basicConfirmButtonInvalidText"} className={"text-danger mb-2 align-self-center"}/>*/}
				<button
					id={"showConfirmEachButton"}
					className="btn btn-primary "
				>
					<span id={"showConfirmEachButtonText"} className="text">
						Confirm it!
					</span>
				</button>
			</div>
		);
	}

	showEachPendingTag() {
		let pendingTagCards = (
			<div>
				<CardMobile>
					<div className=" align-self-center mt-2">
						🤷‍♀️No pending tag at the moment.
					</div>
				</CardMobile>
				<CardMobile>
					<div className=" align-self-center mt-2">
						{" "}
						💡Configure the detection ranges and import data to have
						new results!{" "}
					</div>
				</CardMobile>
			</div>
		);
		// this.state.tagsHistory.map((tag) => (console.log(tag)));
		if (this.state.pendingTags.length > 0) {
			pendingTagCards = this.state.pendingTags.map((pendingTag) => (
				<div
					key={
						"containerPendingTagsCard" +
						useFormatStringForId(pendingTag.name) +
						this.state.pendingTags.indexOf(pendingTag)
					}
				>
					<CardMobile>
						{/* <!-- Card Header - Accordion --> */}
						<a
							href={
								"#pendingTagsCard" +
								useFormatStringForId(pendingTag.name) +
								this.state.pendingTags.indexOf(pendingTag)
							}
							className="card-header collapsed"
							data-toggle="collapse"
							role="button"
							aria-expanded="true"
							aria-controls={
								"pendingTagsCard" +
								pendingTag.name +
								this.state.pendingTags.indexOf(pendingTag)
							}
						>
							<div className={"d-flex justify-content-between"}>
								<div className={"fw-bold text-lg text-primary"}>
									{pendingTag.name}
								</div>
								<div className={"small text-gray-500"}>
									<ConfirmEachButton
										tagName={pendingTag.name}
										tagDatetime={pendingTag.startDatetime}
										tagId={pendingTag.id}
									/>
									{/*{this.showConfirmEachButton()}*/}
									{/*{new Date(pendingTag.updatedAt).toLocaleString('fr-BE', { timeZone: 'UTC' })}*/}
								</div>
							</div>
							<div
								className={
									"text-lg text-center mt-2 text-gray-700"
								}
							>
								{
									new Date(
										pendingTag.startDatetime
									).toLocaleDateString([], {
										weekday: "short",
										day: "2-digit",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									}) /*{new Date(pendingTag.startDatetime).toLocaleDateString([], {timeZone: 'UTC', "weekday": "short", 'day': '2-digit', 'month': "short", "year": "numeric", "hour": '2-digit', "minute": "2-digit"})}*/
								}
							</div>
						</a>
						{/*<!-- Card Content - Collapse -->*/}
						<div
							className="collapse"
							id={
								"pendingTagsCard" +
								useFormatStringForId(pendingTag.name) +
								this.state.pendingTags.indexOf(pendingTag)
							}
						>
							<div className="card-body d-flex justify-content-around">
								<EditTagActivationDialog
									tagName={pendingTag.name}
									tagDatetime={pendingTag.startDatetime}
									tagId={pendingTag.id}
								/>
								<DeleteTagActivationDialog
									tagId={pendingTag.id}
								/>
							</div>
						</div>
					</CardMobile>
				</div>
			));
		}
		return pendingTagCards;
	}

	render() {
		if (this.state.redirect) return <Navigate to="/chartsbytag" />;
		return (
			<div className="container-fluid">
				<div>
					{this.showConfirmAllButton()}
					<CardMobile>
						<CardExample isPendingTag={true} />
					</CardMobile>
					{this.showEachPendingTag()}
				</div>
			</div>
		);
	}
}

export default PendingTags;
