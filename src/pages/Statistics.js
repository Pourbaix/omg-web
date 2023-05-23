import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import IndicatorBar from "../components/StatsComponents/LevelIndicatorBar.js";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { getDataInRange, checkMissingData } from "../services/omgServer";
import { useProcessAvg } from "../hooks/useProcessAvg";

import { useProcessTimeInTargetZone } from "../hooks/useProcessTimeInTargetZone";
import { useCreateGroupByDate } from "../hooks/useCreateGroupByDate";
import { useCreateGroupByType } from "../hooks/useCreateGroupByType";
import { useProcessSumsWithArray } from "../hooks/useProcessSumsWithArray";
import { useRemoveTodayData } from "../hooks/useRemoveTodayData";
import CardBasicTitle from "../components/Cards/CardBasicTitle";

const Statistics = () => {
	const [pageState, setPageState] = useState(1);
	const [lastSelected, setLastSelected] = useState(1);
	const [configState, setConfigState] = useState(false);
	const [loadingState, setLoadingState] = useState(false);

	const [lowLimit, setLowLimit] = useState(70);
	const [highLimit, setHighLimit] = useState(180);

	const [globalData, setGlobalData] = useState([]);

	const [otherNumberOfDays, setOtherNumberOfDays] = useState(0);

	const [datetimeRangeMode, setDatetimeRangeMode] = useState(0);
	const [datetimeRangeValues, setDatetimeRangeValues] = useState([
		new Date().toISOString(),
		new Date().toISOString(),
	]);

	const [datetimeRangeError, setDatetimeRangeError] = useState("");
	const [isMissingData, setIsMissingData] = useState(false);

	const navigate = useNavigate();

	const navs = {
		0: useRef(null),
		1: useRef(null),
	};

	const disableTabs = (tabNumber) => {
		for (let tab in Object.keys(navs)) {
			if (tab != tabNumber) {
				navs[tab].current.classList.add("disabled");
			}
		}
	};

	const switchTab = (tabNumber) => {
		console.log("switching tab to: " + tabNumber);

		navs[lastSelected].current.classList.remove("active");
		navs[tabNumber].current.classList.add("active");
		setLastSelected(tabNumber);
	};

	const handleSaveConfig = () => {
		const saveConfig = {};
		saveConfig["rangeModeConfig"] = datetimeRangeMode;
		if (datetimeRangeMode == 4) {
			saveConfig["specifiedNumberOfDays"] = otherNumberOfDays;
		} else if (datetimeRangeMode == 5) {
			saveConfig["specifiedRangeConfig"] = {
				start: datetimeRangeValues[0],
				end: datetimeRangeValues[1],
			};
		}
		saveConfig["limits"] = {
			low: lowLimit,
			high: highLimit,
		};
		window.localStorage.setItem("statSettings", JSON.stringify(saveConfig));
		window.location.reload();
	};

	const renderSettings = () => {
		return (
			<div className="p-3 w-100">
				{configState ? (
					""
				) : (
					<div className="w-100">
						<p className="text-center text-white bg-warning mb-2">
							Welcome to the statistics page! Please configure the
							given settings.
						</p>
					</div>
				)}
				<h4 className="text-primary">Settings</h4>
				<div
					className="d-flex flex-row w-100 flex-wrap"
					style={{ gap: "15px" }}
				>
					<div className="p-3 border border-2 border-primary rounded">
						<h5 className="text-dark testtest">
							Configure effective time range:
						</h5>
						<div className="">
							<select
								className="form-select mb-2"
								value={datetimeRangeMode}
								onChange={(e) => {
									setDatetimeRangeMode(
										parseInt(e.target.value)
									);
								}}
							>
								<option value="0">Yesterday</option>
								<option value="1">Last 24h</option>
								<option value="2">Last 7 days</option>
								<option value="3">Last 30 days</option>
								<option value="4">Other number of days</option>
								<option value="5">Select a period</option>
							</select>
							{datetimeRangeMode == 4 ? (
								<div className="d-flex flex-column input-group">
									<label htmlFor="days_number form-label">
										Enter a number of days:
									</label>
									<input
										type="number"
										name="number of days"
										id="days_number"
										className="form-control w-100"
										placeholder="Number of days..."
										value={
											otherNumberOfDays
												? otherNumberOfDays
												: ""
										}
										onChange={(e) => {
											let value = e.target.value;
											if (value > 0 && value < 60) {
												setOtherNumberOfDays(
													e.target.value
												);
											}
										}}
									/>
									<div className="form-text">
										Maximum of 60 days
									</div>
								</div>
							) : (
								""
							)}
							{datetimeRangeMode == 5 ? (
								<>
									<p className="m-0">
										Select another period:
									</p>
									<DateTimeRangePicker
										onChange={(result) => {
											setDatetimeRangeError("");
											if (
												new Date(result[0]) <
													new Date() &&
												new Date(result[1]) <=
													new Date()
											) {
												setDatetimeRangeValues(
													result.map((element) => {
														return new Date(
															element
														).toISOString();
													})
												);
											} else {
												setDatetimeRangeError(
													"The start date and the end date cannot be in the future!"
												);
											}
										}}
										value={datetimeRangeValues.map(
											(date) => {
												return new Date(date);
											}
										)}
										timeFormat={false}
									/>
									{datetimeRangeError ? (
										<p className="text-center text-danger">
											{datetimeRangeError}
										</p>
									) : (
										""
									)}
								</>
							) : (
								""
							)}
						</div>
					</div>
					<div className="p-3 border border-2 border-primary rounded">
						<h5 className="text-black">
							Configure max and min glucose range:
						</h5>
						<div className="d-flex flex-wrap">
							<div className="p-1">
								<h5>Min:</h5>
								<input
									type="number"
									value={lowLimit}
									onChange={(e) => {
										setLowLimit(parseFloat(e.target.value));
									}}
								/>
							</div>
							<div className="p-1">
								<h5>Max:</h5>
								<input
									type="number"
									value={highLimit}
									onChange={(e) => {
										setHighLimit(
											parseFloat(e.target.value)
										);
									}}
								/>
							</div>
						</div>
					</div>
					{/* <div className="p-3 border border-2">
						<h5>Test title:</h5>
						<div className="p-3 border border-2">
							<h5>Test title:</h5>
						</div>
					</div>
					<div className="p-3 border border-2">
						<h5>Test title:</h5>
						<div className="p-3 border border-2">
							<h5>Test title:</h5>
						</div>
					</div>
					<div className="p-3 border border-2">
						<h5>Test title:</h5>
						<div className="p-3 border border-2">
							<h5>Test title:</h5>
						</div>
					</div>
					<div className="p-3 border border-2">
						<h5>Test title:</h5>
						<div className="p-3 border border-2">
							<h5>Test title:</h5>
						</div>
					</div> */}
				</div>
				<div className="w-100 pt-4 text-center">
					<button
						className="btn btn-primary"
						onClick={() => {
							handleSaveConfig();
						}}
					>
						Save configuration
					</button>
				</div>
			</div>
		);
	};

	const renderStatistics = () => {
		if (configState) {
			if (loadingState) {
				return (
					<div
						className="w-100 d-flex justify-content-center align-items-center"
						style={{ height: "65vh" }}
					>
						<h2> Loading Statistics...</h2>
					</div>
				);
			} else {
				console.log("CONFIG STATE");
				let glucoseData = globalData["glucose"];
				let insulinData = globalData["insulin"];
				if (glucoseData && insulinData) {
					let avg = useProcessAvg(glucoseData, "glucose");
					let timeInTargetData = useProcessTimeInTargetZone(
						lowLimit,
						highLimit,
						glucoseData
					);

					// Sort data by type and don't use data that is from today
					// If we are in the 'last 24h' config we dont remove today datas
					let typeSortedData =
						datetimeRangeMode != 1
							? useCreateGroupByType(
									useRemoveTodayData(insulinData)
							  )
							: useCreateGroupByType(insulinData);
					function dateSort(a, b) {
						return new Date(a.datetime) > new Date(b.datetime)
							? 1
							: new Date(a.datetime) < new Date(b.datetime)
							? -1
							: 0;
					}

					// Summ all the datas corresponding to a day
					let correctionValuesSumList = useProcessSumsWithArray(
						useCreateGroupByDate(typeSortedData[0].sort(dateSort)),
						"CORRECTION"
					);
					let mealValuesSumList = useProcessSumsWithArray(
						useCreateGroupByDate(
							typeSortedData[1]
								.sort(dateSort)
								.filter(
									(element) =>
										typeof element.insulinDescr === "string"
								)
						),
						"MEAL"
					);
					let basalValuesSumList = useProcessSumsWithArray(
						useCreateGroupByDate(typeSortedData[2].sort(dateSort)),
						"AUTO_BASAL_DELIVERY"
					);

					let finalResults = [
						correctionValuesSumList.reduce(
							(acc, curr) => acc + curr,
							0.0
						) / correctionValuesSumList.length,
						mealValuesSumList.reduce(
							(acc, curr) => acc + curr,
							0.0
						) / mealValuesSumList.length,
						basalValuesSumList.reduce(
							(acc, curr) => acc + curr,
							0.0
						) / basalValuesSumList.length,
					];

					return (
						<div className="w-100 d-flex flex-column">
							<div className="w-100 d-flex border-bottom align-items-center p-3">
								<p className="m-0 me-2">
									Active time configuration:{" "}
								</p>
								<p className="m-0 text-primary fw-bold">
									{datetimeRangeMode == 0
										? "Yesterday"
										: datetimeRangeMode == 1
										? "Last 24h"
										: datetimeRangeMode == 2
										? "Last 7 days"
										: datetimeRangeMode == 3
										? "Last 30 days"
										: datetimeRangeMode == 4
										? "Last " + otherNumberOfDays + " days"
										: "From " +
										  new Date(
												datetimeRangeValues[0]
										  ).toLocaleString() +
										  " To " +
										  new Date(
												datetimeRangeValues[1]
										  ).toLocaleString()}
								</p>
								<p
									className="m-0 ms-2"
									style={{
										textDecoration: "underline",
										cursor: "pointer",
									}}
									onClick={() => {
										setPageState(1);
										switchTab(1);
									}}
								>
									Modify...
								</p>
							</div>
							{isMissingData ? (
								<div className="w-100 bg-warning d-flex flex-column align-items-center">
									<span className="text-white weight-bold">
										Found missing data in the selected
										period! Statistics might not be exact.
									</span>
									<span className="text-white weight-bold">
										Click{" "}
										<span
											onClick={() => {
												navigate("/dataManager");
											}}
											style={{
												textDecoration: "underline",
												cursor: "pointer",
												fontWeight: "bold",
											}}
										>
											here
										</span>{" "}
										to see missing data periods
									</span>
								</div>
							) : (
								""
							)}
							<div className="w-100 d-flex flex-wrap">
								<div
									className="m-2 mb-0"
									style={{ width: "max-content" }}
								>
									<CardBasicTitle
										title={"Average glucose level per day"}
									>
										<div
											style={{
												width: "300px",
												margin: "auto",
											}}
										>
											<IndicatorBar
												min={lowLimit}
												max={highLimit}
												actualPosition={avg.toFixed(1)}
											/>
										</div>
										<div className="m-3 ms-1">
											▹ Percentage of time in{" "}
											<span className="fw-bold text-success">
												target
											</span>{" "}
											zone:{" "}
											<span className="ps-2 pe-2 pt-1 pb-1 border rounded fw-bold">
												{(
													timeInTargetData.valid * 100
												).toFixed(1)}{" "}
												%
											</span>
										</div>
										<div className="m-3 ms-1">
											▹ Percentage of time in{" "}
											<span
												className="fw-bold"
												style={{
													color: "rgb(249, 220, 4)",
												}}
											>
												hyper
											</span>{" "}
											zone:{" "}
											<span className="ps-2 pe-2 pt-1 pb-1 border rounded fw-bold">
												{(
													timeInTargetData.hyper * 100
												).toFixed(1)}{" "}
												%
											</span>
										</div>
										<div className="m-3 ms-1">
											▹ Percentage of time in{" "}
											<span className="fw-bold text-danger">
												hypo
											</span>{" "}
											zone:{" "}
											<span className="ps-2 pe-2 pt-1 pb-1 border rounded fw-bold">
												{(
													timeInTargetData.hypo * 100
												).toFixed(1)}{" "}
												%
											</span>
										</div>
									</CardBasicTitle>
								</div>
								<div
									className="m-2"
									style={{
										width: "max-content",
									}}
								>
									<CardBasicTitle
										title={
											<p>
												Average daily insulin quantity{" "}
												<br /> by type (in Units)
											</p>
										}
									>
										<div>
											<ul className="mt-3">
												<li className="m-2 mb-3 ms-0">
													Basal Insulin:{" "}
													<span className="p-1 border rounded text-primary">
														{finalResults[2].toFixed(
															2
														)}
													</span>
												</li>
												<li className="m-2 mb-3 ms-0">
													Correction Bolus:{" "}
													<span className="p-1 border rounded text-primary">
														{finalResults[0].toFixed(
															2
														)}
													</span>
												</li>
												<li className="m-2 mb-3 ms-0">
													Meal Bolus:{" "}
													<span className="p-1 border rounded text-primary">
														{finalResults[1].toFixed(
															2
														)}
													</span>{" "}
												</li>
												<li className="m-2 mb-3 ms-0">
													All types together:
													<span className="ms-1 p-1 border rounded text-primary">
														{(
															finalResults[0] +
															finalResults[1] +
															finalResults[2]
														).toFixed(2)}
													</span>
												</li>
											</ul>
											<div className="d-flex justify-content-center">
												<p className="m-0 fw-bold well">
													100 Units = 1ml of insulin
												</p>
											</div>
										</div>
									</CardBasicTitle>
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<div>
							<h3 className="text-warning">
								{glucoseData
									? "Found no glucose data !"
									: "Found no insulin data !"}
							</h3>
						</div>
					);
				}
			}
		} else {
			return (
				<div>
					<h2 className="text-danger">
						No configuration detected, please first configure via
						the settings !
					</h2>
				</div>
			);
		}
	};

	const renderPage = () => {
		if (configState) {
			switch (pageState) {
				case 0:
					return renderStatistics();
				case 1:
					return renderSettings();
			}
		} else {
			return renderSettings();
		}
	};

	const fetchStatisticData = async (startDate, endDate) => {
		let response = await getDataInRange(startDate, endDate);
		setGlobalData(response);
	};

	const checkWarningDataHoles = async () => {
		let missingData = await checkMissingData();
		let isMissing = false;
		console.log("checking missing data");
		missingData.forEach((element) => {
			if (
				new Date(element.start) > new Date(datetimeRangeValues[0]) &&
				new Date(element.end) < new Date(datetimeRangeValues[1])
			) {
				isMissing = true;
			}
		});
		setIsMissingData(isMissing);
	};

	const init = async () => {
		console.log("init");
		let config = window.localStorage.getItem("statSettings");
		if (config) {
			console.log("config detected");

			// Read config and apply it
			setConfigState(true);
			switchTab(0);
			setPageState(0);
			setLoadingState(true);

			let parsedResponse = JSON.parse(config);
			let currentTimeMs;
			let targetTimeMS;
			let final_date;
			switch (parseInt(parsedResponse.rangeModeConfig)) {
				case 0:
					// Yesterday
					setDatetimeRangeMode(0);
					currentTimeMs = new Date().getTime();
					targetTimeMS = currentTimeMs - 86400000;
					final_date = new Date();
					final_date.setTime(targetTimeMS);
					final_date.setHours(0);
					final_date.setMinutes(0);
					final_date.setSeconds(0);
					fetchStatisticData(
						final_date.toISOString(),
						new Date().toISOString()
					);
					setDatetimeRangeValues([
						final_date.toISOString(),
						new Date().toISOString(),
					]);
					break;

				case 1:
					// Last 24h
					setDatetimeRangeMode(1);
					currentTimeMs = new Date().getTime();
					targetTimeMS = currentTimeMs - 86400000;
					final_date = new Date();
					final_date.setTime(targetTimeMS);
					await fetchStatisticData(
						final_date.toISOString(),
						new Date().toISOString()
					);
					setDatetimeRangeValues([
						final_date.toISOString(),
						new Date().toISOString(),
					]);
					break;

				case 2:
					// Last 7 days
					setDatetimeRangeMode(2);
					currentTimeMs = new Date().getTime();
					targetTimeMS = currentTimeMs - 7 * 86400000;
					final_date = new Date();
					final_date.setTime(targetTimeMS);
					final_date.setHours(0);
					final_date.setMinutes(0);
					final_date.setSeconds(0);
					await fetchStatisticData(
						final_date.toISOString(),
						new Date().toISOString()
					);
					setDatetimeRangeValues([
						final_date.toISOString(),
						new Date().toISOString(),
					]);
					break;

				case 3:
					// Last 30 days
					setDatetimeRangeMode(3);
					currentTimeMs = new Date().getTime();
					targetTimeMS = currentTimeMs - 30 * 86400000;
					final_date = new Date();
					final_date.setTime(targetTimeMS);
					final_date.setHours(0);
					final_date.setMinutes(0);
					final_date.setSeconds(0);
					await fetchStatisticData(
						final_date.toISOString(),
						new Date().toISOString()
					);
					setDatetimeRangeValues([
						final_date.toISOString(),
						new Date().toISOString(),
					]);
					break;

				case 4:
					// User specified a number of days
					setDatetimeRangeMode(4);
					currentTimeMs = new Date().getTime();
					targetTimeMS =
						currentTimeMs -
						parsedResponse.specifiedNumberOfDays * 86400000;
					final_date = new Date();
					final_date.setTime(targetTimeMS);
					final_date.setHours(0);
					final_date.setMinutes(0);
					final_date.setSeconds(0);
					await fetchStatisticData(
						final_date.toISOString(),
						new Date().toISOString()
					);
					setOtherNumberOfDays(parsedResponse.specifiedNumberOfDays);
					setDatetimeRangeValues([
						final_date.toISOString(),
						new Date().toISOString(),
					]);
					break;
				case 5:
					// User specified a datetime range
					setDatetimeRangeMode(5);
					await fetchStatisticData(
						parsedResponse.specifiedRangeConfig.start,
						parsedResponse.specifiedRangeConfig.end
					);
					setDatetimeRangeValues([
						new Date(parsedResponse.specifiedRangeConfig.start),
						new Date(parsedResponse.specifiedRangeConfig.end),
					]);
			}
			setHighLimit(parseFloat(parsedResponse.limits.high));
			setLowLimit(parseFloat(parsedResponse.limits.low));
			setLoadingState(false);
		} else {
			// If there is no configuration active, ask the user to configure
			setConfigState(false);
			disableTabs(1);
		}
	};

	useEffect(() => {
		const checkHoles = async () => {
			await checkWarningDataHoles();
		};
		checkHoles();
	}, [datetimeRangeValues]);

	useEffect(() => {
		init();
	}, []);

	return (
		<div className="container-fluid">
			<div>
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a
							className="nav-link"
							style={{ cursor: "pointer" }}
							onClick={() => {
								setPageState(0);
								switchTab(0);
							}}
							ref={navs[0]}
						>
							<i className="fas fa-fw fa-chart-line" />
							Statistics
						</a>
					</li>
					<li className="nav-item ms-auto">
						<a
							className="nav-link active"
							style={{ cursor: "pointer" }}
							onClick={() => {
								setPageState(1);
								switchTab(1);
							}}
							ref={navs[1]}
						>
							<i className="fas fa-wrench pe-2" />
							Settings
						</a>
					</li>
				</ul>
			</div>
			<div className="border-start border-bottom border-end d-flex bg-white">
				{renderPage()}
			</div>
		</div>
	);
};

export default Statistics;
