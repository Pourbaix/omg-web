import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
	getCountAllActivations,
	getTagsHistory,
	getTagsHistoryByActivationTime,
} from "../services/omgServer";
import CardMobile from "../components/Cards/CardMobile";
import EditTagActivationDialog from "../components/Dialogs/EditTagActivationDialog";
import DeleteTagActivationDialog from "../components/Dialogs/DeleteTagActivationDialog";
import { useFormatStringForId } from "../hooks/useFormatStringForId";
import { useHasMore } from "../hooks/useHasMore";
import CardExample from "../components/Cards/CardExample";

/**
 * This class represents a list of tags created.
 * The list is sorted by event name by default.
 * A toggle button is shown at the top and used to sort by
 * created time and go back to the default sort.
 * There is an example card to display the column names.
 * The 10 most recent tags will be displayed.
 * While scrolling, the next tags will be loaded
 * so that you can see every tag from the
 * first day you start to monitor the data.
 */
class TagsHistory extends Component {
	/**
	 * First thing loaded with this page.
	 * Props is an external storage (while state is local (inside this  class only)).
	 * Props not used for the moment.
	 * items also not used.
	 * tagsHistory is loaded with most recent tags sorted by event date.
	 * sortByActivationTime is a boolean which will
	 * defines what to render (sort by event or created time ?).
	 * lastDatetime filled when the last of the most recent tags is known.
	 * tagHistoryCount will contain the number of entries in the DB (tags).
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			items: Array.from({ length: 20 }),
			tagsHistory: this.loadTags(new Date(Date.now()).toISOString()),
			sortByActivationTime: true,
			lastDatetime: undefined,
			tagHistoryCount: null, // Number of tags activation for one user
		};
	}

	/**
	 * Called after the render so DOM nodes exists.
	 * setState causes the re render but its happening right after
	 * the first render (called by constructor). (We won't see the two render, only the last)
	 * getCountAllActivations fetches the number of entries in the DB (tags)
	 * and store it in tagHistoryCount.
	 */
	componentDidMount() {
		getCountAllActivations().then((res) =>
			this.setState({ tagHistoryCount: res })
		);
		// getCountAllActivations().then((res) => console.log(res));
	}

	// componentDidUpdate(prevProps, prevState, snapshot) {
	//     if (this.state.tagsHistory !== prevState.tagsHistory) {
	//         console.log(this.state.tagsHistory);
	//     }
	//     if (this.state.tagsHistoryCount !== prevState.tagsHistoryCount) {
	//         console.log(this.state.tagsHistoryCount);
	//     }
	// }

	/**
	 * Called on the page loading to fill state.tagsHistory
	 * then called by buttonNewSortClick and eventually by InfiniteScroll.
	 * The default param is only used when the call is made from
	 * InfiniteScroll (to get to next data knowing the last data we have).
	 * getTagsHistoryByActivationTime (omgServer.js) fetches data with
	 * this url : /tags/recentHistory?datetimeBegin=
	 * Then it sets state.tagsHistory (last else) on the page loading
	 * It concat data if state.lastDatetime is not undefined (scroll case, first if)
	 * Last case when the user has already sorted and want to sort by
	 * event datetime again (it reset the state at the initial value).
	 * Be careful, nasty behaviour. A small change can break the scroll or whatever
	 * @param datetime
	 */
	loadTags = (
		datetime = this.state.tagsHistory[this.state.tagsHistory.length - 1][
			"startDatetime"
		]
	) => {
		getTagsHistoryByActivationTime(datetime).then((data) => {
			if (this.state.tagsHistory) {
				if (!this.state.lastDatetime) {
					// console.log("👍state.tagsHistory:\n" + JSON.stringify(data, null, 1));
					this.setState({
						tagsHistory: this.state.tagsHistory.concat(data),
					});
				} else {
					// console.log("👎👎!state.tagsHistory:\n" + JSON.stringify(data, null, 1));
					this.setState({ tagsHistory: data });
					this.setState({ lastDatetime: undefined });
				}
			} else {
				// console.log("👎!state.tagsHistory:\n" + JSON.stringify(data, null, 1));
				this.setState({ tagsHistory: data });
			}
		});
		// }
	};

	/**
	 * Called by buttonSortClick and eventually by InfiniteScroll.
	 * The default param is only used when the call is made from
	 * InfiniteScroll (to get to next data knowing the last data we have).
	 * By default, lastDatetime is undefined so tagsHitsory will be filled.
	 * LastDatetime is not undefined so next time it will
	 * only concat data (to load while you scroll).
	 * Be careful, nasty behaviour. A small change can break the scroll or whatever
	 * @param datetime
	 */
	loadTagsByCreateDate = (datetime = this.state.lastDatetime) => {
		getTagsHistory(datetime).then((data) => {
			if (!this.state.lastDatetime) {
				this.setState({ tagsHistory: data });
				this.setState({
					lastDatetime:
						this.state.tagsHistory[
							this.state.tagsHistory.length - 1
						]["updatedAt"],
				});
			} else {
				this.setState({
					tagsHistory: this.state.tagsHistory.concat(data),
				});
			}
		});
	};
	/**
	 * This is the first click you can do (on the sort button).
	 * It changes the value of sortByActivationTime
	 * and causes the re rendering of the page (with new button, data and scroll params).
	 * Then it calls loadTagsByCreateDate which
	 * will set state.tagsHistory with the data from the DB.
	 */
	buttonSortClick = () => {
		this.setState({ sortByActivationTime: false }, () => {
			this.loadTagsByCreateDate(new Date(Date.now()).toISOString());
		});
	};

	/**
	 * This is the next click you can do (on the sort button).
	 * It will sort the data by event time.
	 */
	buttonNewSortClick = () => {
		this.setState({ sortByActivationTime: true }, () => {
			this.loadTags(new Date(Date.now()).toISOString());
		});
	};

	/**
	 * Button showed by default. Used to sort data below by created (updated ?) time.
	 * @returns {JSX.Element}
	 */
	showBasicConfirmButton() {
		return (
			<div className="align-self-center d-flex flex-column">
				{/*<div id={"basicConfirmButtonInvalidText"} className={"text-danger mb-2 align-self-center"}/>*/}
				<button
					id={"basicConfirmButton"}
					className="btn btn-primary align-self-center mb-2"
					onClick={this.buttonSortClick}
				>
					<span id={"basicConfirmButtonText"} className="text">
						Sort by creation time
					</span>
					<div>
						<span
							id={"basicConfirmButtonHint"}
							className="font-italic text-gray-300 small"
						>
							current: by <b>event</b> date
						</span>
					</div>
				</button>
			</div>
		);
	}
	/**
	 * Button showed after the click on the previous button. Used to sort data below by event time.
	 * @returns {JSX.Element}
	 */
	showNewConfirmButton() {
		return (
			<div className="align-self-center d-flex flex-column">
				{/*<div id={"basicConfirmButtonInvalidText"} className={"text-danger mb-2 align-self-center"}/>*/}
				<button
					id={"basicConfirmButton"}
					className="btn btn-primary align-self-center mb-2"
					onClick={this.buttonNewSortClick}
				>
					<span id={"basicConfirmButtonText"} className="text">
						Sort by event time
					</span>
					<div>
						<span
							id={"basicConfirmButtonHint"}
							className="font-italic text-gray-300 small"
						>
							current: by <b>creation</b> date
						</span>
					</div>
				</button>
			</div>
		);
	}

	/**
	 * Card with static data to show the meaning of each data displayed below
	 * @returns {JSX.Element}
	 */
	// showCardExample(){
	//     return (
	//         <div className="card-header collapsed ">
	//             <div className={"d-flex justify-content-between"}>
	//                 <div className={"fw-bold text-lg"}>
	//                     <u>Event name</u>
	//                 </div>
	//                 <div className={"fw-bold text-lg"}>
	//                     <u>Creation date</u>
	//                 </div>
	//             </div>
	//             <div className={"fw-bold text-lg text-center"}>
	//                 <u>Event date</u>
	//             </div>
	//         </div>
	//     );
	// }

	/**
	 * EDIT: removed into src/hooks/use...
	 * It takes the string, check if it includes non authorized character
	 * to set an id, removes it and return the cleaned string
	 * @param string
	 * @returns string
	 */
	formatStringForId = (str) => {
		// let regex = /[A-Za-z]|[0-9]|\.|\-|\:|\_/gi;
		let regex = /[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\uFFFF]/gu;
		let newStr = str.replaceAll(regex, "");
		return newStr;
	};

	/**
	 * It checks state.tagsHistory to display the tag name,
	 * the created (updatedAt ?) datetime and the event datetime of each tag retrieved from the DB.
	 * The three data are wrapped in a <a> which works as a toggle button to
	 * display an edit button and a delete button.
	 * @returns {JSX.Element}
	 */
	setInfiniteScrollContent() {
		let message = <div>Loading...</div>;
		// this.state.tagsHistory.map((tag) => (console.log(tag)));
		if (this.state.tagsHistory) {
			message = this.state.tagsHistory.map((tag) => (
				<div
					key={
						"containerTagsHistoryCard" +
						useFormatStringForId(tag["name"]) +
						this.state.tagsHistory.indexOf(tag)
					}
				>
					<CardMobile>
						{/* <!-- Card Header - Accordion --> */}
						<a
							href={
								"#tagCard" +
								useFormatStringForId(tag["name"]) +
								this.state.tagsHistory.indexOf(tag)
							}
							className="card-header collapsed"
							data-bs-toggle="collapse"
							role="button"
							aria-expanded="true"
							aria-controls={
								"tagCard" +
								tag["name"] +
								this.state.tagsHistory.indexOf(tag)
							}
						>
							<div className={"d-flex justify-content-between"}>
								<div className={"fw-bold text-lg text-primary"}>
									{tag["name"]}
								</div>
								<div className={"small text-gray-500"}>
									{new Date(
										tag["updatedAt"]
									).toLocaleString()}
								</div>
							</div>
							<div
								className={
									"text-lg text-center mt-2 text-gray-700"
								}
							>
								{new Date(
									tag["startDatetime"]
								).toLocaleDateString([], {
									weekday: "short",
									day: "2-digit",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
							<div
								className={
									"small text-center mt-2 font-italic text-gray-600"
								}
							>
								{tag["wasAuto"]
									? "Automatically generated"
									: "Manually generated"}
							</div>
						</a>
						{/*<!-- Card Content - Collapse -->*/}
						<div
							className="collapse"
							id={
								"tagCard" +
								useFormatStringForId(tag["name"]) +
								this.state.tagsHistory.indexOf(tag)
							}
						>
							<div className="card-body d-flex justify-content-around">
								<EditTagActivationDialog
									tagName={tag["name"]}
									tagDatetime={tag["startDatetime"]}
									tagId={tag["id"]}
								/>
								<DeleteTagActivationDialog tagId={tag["id"]} />
							</div>
						</div>
					</CardMobile>
				</div>
			));
		}
		return message;
	}

	/**
	 * Once the component is ready, state.tagHistoryCount is loaded with
	 * the result of getAllActivation (should be renamed getAllEventTag) which is
	 * the number of entries in the DB related to tags.
	 * hasMore is called in the params of InfiniteScroll which calls loadTags if true. Then
	 * state.tagsHistory will be loaded with data until its reaches the number stored in tagHistoryCount
	 * @returns {boolean}
	 */
	hasMore = () => {
		let ret = true;
		if (this.state.tagHistoryCount) {
			if (this.state.tagHistoryCount <= this.state.tagsHistory.length) {
				ret = false;
			}
		}
		return ret;
		// useHasMore(this.state.rangesHistoryCount, this.state.rangesHistory);
	};

	/**
	 * state.tagsHistory should be loaded with data (from DB)
	 * This component show a button (used to sort data),
	 * a cardExample (name of column) wrapped with
	 * CardMobile component (used to change style if mobile screen detected),
	 * call setInfiniteScrollContent (which creates a card for each tag found in state.tagsHistory).
	 * infiniteScroll (react lib import) will check if there is more data coming and load more while you scroll.
	 * The div mt-3 is useless ?
	 * @returns {JSX.Element}
	 */
	setInfiniteScrollComponent() {
		if (this.state.tagsHistory) {
			return (
				<div>
					{this.showBasicConfirmButton()}
					<CardMobile>
						<CardExample isHistoryTag={true} />
					</CardMobile>
					<InfiniteScroll
						dataLength={this.state.tagsHistory.length}
						next={this.loadTags}
						hasMore={this.hasMore()}
						loader={<p>Loading...</p>}
					>
						{this.setInfiniteScrollContent()}
					</InfiniteScroll>
					<div className={"mt-3"} />
				</div>
			);
		} else {
			return <div>Loading...</div>;
		}
	}

	/**
	 * Almost the same as setInfiniteScrollComponent but call
	 * loadTagsByCreateDate instead of loadTags (by event datetime)
	 * @returns {JSX.Element}
	 */
	setSortedInfiniteScrollComponent() {
		if (this.state.tagsHistory) {
			return (
				<div>
					{this.showNewConfirmButton()}
					<CardMobile>
						<CardExample isHistoryTag={true} />
					</CardMobile>
					<InfiniteScroll
						dataLength={this.state.tagsHistory.length}
						next={this.loadTagsByCreateDate}
						hasMore={this.hasMore()}
						loader={<p>Loading...</p>}
					>
						{this.setInfiniteScrollContent()}
					</InfiniteScroll>
					<div className={"mt-3"} />
				</div>
			);
		} else {
			return <div>Loading...</div>;
		}
	}

	/**
	 * Render setInfiniteScrollComponent (data sorted by event datetime) by default.
	 * When buttonSortClick is triggered, state.sortByActivationTime update its value and
	 * render setSortedInfiniteScrollComponent (data sorted by creation datetime)
	 * @returns {JSX.Element}
	 */
	render() {
		const sortByActivationTime = this.state.sortByActivationTime;
		let scrollCompo;
		if (sortByActivationTime) {
			scrollCompo = this.setInfiniteScrollComponent();
		} else {
			scrollCompo = this.setSortedInfiniteScrollComponent();
		}
		return (
			<div className="container-fluid">
				{/* <div sortByActivationTime={sortByActivationTime}> */}
				<div>{scrollCompo}</div>
			</div>
		);
	}
}

export default TagsHistory;
