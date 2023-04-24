import {
	Chart as ChartJS,
	TimeScale,
	LinearScale,
	BarController,
	CategoryScale,
	BarElement,
	LineController,
	LineElement,
	PointElement,
	Legend,
	Tooltip,
	Title,
	Filler,
} from "chart.js";
import { useRef, useEffect, useState } from "react";
import { Line, Bar, Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
	getLastXhData,
	getTagsInRange,
	checkMissingData,
} from "../../../services/omgServer";
import { useCreateDataStructureHomeChart } from "../../../hooks/useCreateDataStructure";
import Meal from "../../../assets/meal.svg";

const DefaultHomeChart = (props) => {
	const [globalData, setGlobalData] = useState([]);
	const [tagsData, setTagsData] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [barWidth, setBarWidth] = useState(4);

	const [maxGlucoseValue, setMaxGlucoseValue] = useState(400);

	const [dataState, setDataState] = useState({
		glucose: true,
		meal: true,
		basal: true,
		correction: true,
	});

	const [tagsDisplay, setTagsDisplay] = useState(
		JSON.parse(window.localStorage.getItem("defaultChartSettings")) &&
			JSON.parse(window.localStorage.getItem("defaultChartSettings"))[
				"displayTags"
			] !== "undefined"
			? JSON.parse(window.localStorage.getItem("defaultChartSettings"))[
					"displayTags"
			  ]
			: false
	);

	const [dataHoles, setDataHoles] = useState([]);
	const [filteredDataHoles, setFilteredDataHoles] = useState([]);

	const chartRef = useRef(null);

	const title = useRef("Chart for last 24h data");

	const tagsColorList = [
		"#8934eb",
		"#3468eb",
		"#34dceb",
		"#34eb5c",
		"#96eb34",
		"#e2eb34",
		"#ebab34",
		"#eb3d34",
		"#eb345f",
		"#eb34cc",
		"#b434eb",
		"#2e2e2e",
		"#34eb89",
		"#2900cc",
		"#b100cc",
		"#00cc22",
		"#cccc00",
	];

	ChartJS.register([
		TimeScale,
		LinearScale,
		LineController,
		BarController,
		CategoryScale,
		BarElement,
		PointElement,
		LineElement,
		Legend,
		Tooltip,
		Title,
		Filler,
	]);

	const needsToBeDisplayed = (name) => {
		let translator = {
			Glucose: "glucose",
			"Basal Insulin": "basal",
			"Meal Bolus": "meal",
			"Correction Bolus": "correction",
		};
		if (Object.keys(translator).includes(name)) {
			let equivalence = translator[name];
			return dataState[equivalence];
		} else {
			return false;
		}
	};

	const processBarWidth = (dataStartDate = null, dataEndDate = null) => {
		if (dataStartDate && dataEndDate) {
			let currentMsDisplayed =
				new Date(dataEndDate).getTime() -
				new Date(dataStartDate).getTime();
			let currentHoursDisplayed = currentMsDisplayed / 3600000;
			if (currentHoursDisplayed) {
				setBarWidth(52 / currentHoursDisplayed);
			}
		} else {
			setBarWidth(18);
		}
	};

	const down = (ctx, value) =>
		ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

	const skipped = (ctx, value) =>
		ctx.p0.skip || ctx.p1.skip ? value : undefined;

	const holes = (ctx, value) => {
		let final_value = undefined;
		filteredDataHoles.forEach((element) => {
			if (
				ctx.p0.raw.datetime == element.start &&
				ctx.p1.raw.datetime == element.end
			) {
				final_value = value;
			}
		});
		return final_value;
	};
	let data = {
		datasets: [
			{
				type: "line",
				label: "Glucose",
				data: globalData,
				borderColor: "#4e73df",
				backgroundColor: "#4e73df",
				tension: 0.2,
				borderWidth: 2,
				pointRadius: 0.1,
				// Remplir l'espace en dessous de la courbe
				fill: false,
				pointBackgroundColor: "#4e73df",
				pointBorderColor: "#4e73df",
				pointHoverRadius: !dataState["meal"]
					? 8
					: globalData.map((x) => {
							return x.data["pointHoverRadius"];
					  }),
				pointHoverBackgroundColor: "#4e73df",
				pointHoverBorderColor: "rgba(255, 255, 255, 0.4)",
				pointHoverBorderWidth: 3,
				pointHitRadius: 5,
				pointBorderWidth: 0,
				pointStyle: !dataState["meal"]
					? "circle"
					: globalData.map((x) => {
							return x.data["pointStyle"];
					  }),
				spanGaps: false,
				yAxisID: "y",
				parsing: {
					xAxisKey: "datetime",
					yAxisKey: "data.glucose",
				},
				hidden: !dataState["glucose"],
				order: 2,
				segment: {
					borderDash: (ctx) => holes(ctx, [4, 4]),
					borderColor: (ctx) => holes(ctx, "grey"),
				},
			},
			{
				type: "bar",
				label: "Basal Insulin",
				data: globalData,
				borderColor: "#df4e83",
				backgroundColor: "#df4e83",
				fill: true,
				barThickness: barWidth,
				barPercentage: 1,
				borderWidth: 1,
				categoryPercentage: 1,
				tension: 0,
				borderWidth: 1,
				spanGaps: false,
				yAxisID: "basal",
				parsing: {
					xAxisKey: "datetime",
					yAxisKey: "data.basal",
				},
				hidden: !dataState["basal"],
			},
			{
				type: "line",
				label: "Meal Bolus",
				data: globalData,
				borderColor: "#df4e83",
				backgroundColor: "#ffff",
				tension: 0,
				borderWidth: 2,
				pointRadius: 0,
				spanGaps: false,
				yAxisID: "y",
				parsing: {
					xAxisKey: "datetime",
					yAxisKey: "data.meal",
				},
				hidden: !dataState["meal"],
			},
			{
				type: "bar",
				label: "Correction Bolus",
				data: globalData,
				borderColor: "#ba03fc",
				backgroundColor: "#ba03fc",
				fill: true,
				barThickness: barWidth,
				barPercentage: 1,
				borderWidth: 1,
				categoryPercentage: 1,
				tension: 0,
				borderWidth: 1,
				spanGaps: false,
				yAxisID: "correction",
				parsing: {
					xAxisKey: "datetime",
					yAxisKey: "data.correction",
				},
				hidden: !dataState["correction"],
			},
		],
	};

	// Plugin to increase padding after legend
	const legendMargin = {
		id: "legendMargin",
		beforeInit(chart, legend, options) {
			const fitValue = chart.legend.fit;

			chart.legend.fit = function fit() {
				fitValue.bind(chart.legend)();
				return (this.height += 20);
			};
		},
	};

	// Plugin to display tags
	const tagsLabels = {
		id: "tagsLabels",
		afterDatasetsDraw(chart, args, plugins) {
			const {
				ctx,
				data,
				chartArea: { top, bottom, left, right, width, height },
				scales: { x, y },
			} = chart;
			ctx.save();

			ctx.beginPath();
			ctx.moveTo(200, 200);
			ctx.lineTo(210, 208);
			ctx.lineTo(245, 208);
			ctx.lineTo(245, 192);
			ctx.lineTo(210, 192);
			ctx.lineTo(200, 200);
			ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
			ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
			// ctx.roundRect(200, top + height / 2, 100, 30, 5);
			// ctx.rect(400, top + height / 2, 30, 20);
			ctx.stroke();
			ctx.fill();
		},
	};

	const tagsLabelsMarkers = {
		id: "tagsLabelsMarkers",
		beforeDatasetsDraw(chart, args, plugins) {
			const {
				ctx,
				chartArea: { top, bottom, height },
				scales: { x },
			} = chart;

			function dateSort(a, b) {
				return new Date(a.startDatetime) > new Date(b.startDatetime)
					? 1
					: new Date(a.startDatetime) < new Date(b.startDatetime)
					? -1
					: 0;
			}

			const findHeightFromDatetime = (ISODate) => {
				let date = new Date(ISODate);
				let hour = date.getMinutes();
				let perc = hour / 60;
				return perc;
			};

			if (plugins.data && tagsDisplay) {
				plugins.data.sort(dateSort).forEach((tag, index) => {
					ctx.save();
					ctx.beginPath();
					ctx.strokeStyle = tagsColorList[(index + 1) % 16];
					ctx.lineWidth = 1.5;
					ctx.moveTo(
						x.getPixelForValue(
							new Date(tag.startDatetime).getTime()
						),
						top
					);
					ctx.lineTo(
						x.getPixelForValue(
							new Date(tag.startDatetime).getTime()
						),
						bottom
					);
					ctx.stroke();

					const angle = Math.PI / 180;
					findHeightFromDatetime(tag.startDatetime);
					ctx.translate(
						x.getPixelForValue(
							new Date(tag.startDatetime).getTime()
						) + 5,
						top + height / 8 + (height / 16) * ((index + 1) % 8)
					);

					ctx.rotate(90 * angle);
					ctx.font = "bold 12px sans-serif";
					ctx.textAlign = "center";
					ctx.fillStyle = tagsColorList[(index + 1) % 16];
					ctx.fillText(tag.name, 0, 0);

					ctx.restore();
				});
			}
		},
	};

	const options = {
		layout: {
			// padding: 25,
		},
		scales: {
			x: {
				type: "time",
				offset: true,
				grid: {
					offset: false,
				},
				time: {
					displayFormats: {
						hour: "HH:mm",
						unit: "hour",
					},
				},
				ticks: {
					major: {
						enabled: true,
					},
					font: (context) => {
						const boldedTicks =
							context.tick &&
							new Date(context.tick.value)
								.toLocaleTimeString()
								.slice(0, -3) === "00:00"
								? "bold"
								: "";

						const fontSize =
							context.tick &&
							new Date(context.tick.value)
								.toLocaleTimeString()
								.slice(0, -3) === "00:00"
								? "14px"
								: "12px";

						return {
							weight: boldedTicks,
							size: fontSize,
						};
					},
					color: (context) => {
						const color =
							context.tick &&
							new Date(context.tick.value)
								.toLocaleTimeString()
								.slice(0, -3) === "00:00"
								? "#4e73df"
								: "#000";
						return color;
					},
					callback: (label, index, labels) => {
						if (
							labels[index].major &&
							new Date(label)
								.toLocaleTimeString()
								.slice(0, -3) === "00:00"
						) {
							return new Date(label).toDateString().slice(0, -5);
						} else {
							return new Date(label)
								.toLocaleTimeString()
								.slice(0, -3);
						}
					},
				},
			},
			y: {
				beginAtZero: true,
				type: "linear",
				position: "left",
				max: maxGlucoseValue,
				title: {
					display: true,
					text: "Glucose data (mg/dl)",
					fullSize: true,
					color: "#4e73df",
					font: {
						size: "14px",
						weight: "bold",
					},
				},
				ticks: {
					color: "#4e73df",
				},
			},
			correction: {
				beginAtZero: true,
				type: "linear",
				position: "right",
				max: 2.25,
				display: dataState["correction"],
				reverse: true,
				ticks: {
					color: "#ba03fc",
					callback: (label, index, labels) => {
						return label > 2 ? "" : label;
					},
				},
				title: {
					display: true,
					text: "Correction Bolus",
					color: "#ba03fc",
					font: {
						size: "12vw",
						weight: "bold",
					},
					padding: {
						left: 150,
					},
				},
				grid: {
					display: false,
				},
				stack: "rightSide",
			},
			basal: {
				beginAtZero: true,
				type: "linear",
				position: "right",
				max: 0.6,
				display: dataState["basal"],
				reverse: false,
				ticks: {
					color: "#df4e83",
					callback: (label, index, labels) => {
						return label > 0.5 ? "" : label;
					},
				},
				title: {
					display: true,
					text: "Basal Insulin",
					color: "#df4e83",
					font: {
						size: "12vw",
						weight: "bold",
					},
				},
				grid: {
					display: false,
				},
				stack: "rightSide",
			},
		},
		responsive: true,
		plugins: {
			title: {
				display: false,
				text: title.current,
				fullSize: true,
				font: {
					size: "18px",
				},
				padding: 0,
			},
			legend: {
				display: true,
				position: "top",
				labels: {
					usePointStyle: true,
					padding: 25,
					font: {
						family: '"Gill-sans", sans-serif',
						weight: "500",
						size: "12px",
					},
					generateLabels: (chart) => {
						let mealImage = new Image(22, 22);
						mealImage.src = Meal;
						let pointStyleArray = ["cirle", "circle", mealImage];
						return chart.config["_config"].data.datasets.map(
							(dataset, index) => ({
								text: dataset.label,
								hidden: !needsToBeDisplayed(dataset.label),
								fillStyle: dataset.backgroundColor,
								fontColor: "#000",
								strokeStyle: dataset.borderColor,
								pointStyle: pointStyleArray[index],
							})
						);
					},
				},
				onClick: (click, legendItem, legend) => {
					if (needsToBeDisplayed(legendItem.text)) {
						const datasets = legend.legendItems.map(
							(dataset, index) => {
								return dataset.text;
							}
						);

						const index = datasets.indexOf(legendItem.text);
						if (legend.chart.isDatasetVisible(index) === true) {
							if (index == 2) {
								let targetDataset =
									chartRef.current["_metasets"][0][
										"_dataset"
									];
								targetDataset.pointStyle = "circle";
								targetDataset.pointHoverRadius = "8";
							}
							chartRef.current.hide(index);
							chartRef.current["legend"].legendItems[
								index
							].fontColor = "#bfbfbf";
							chartRef.current.legend.update();
							chartRef.current.update();
						} else {
							if (index == 2) {
								let targetDataset =
									chartRef.current["_metasets"][0][
										"_dataset"
									];
								targetDataset.pointStyle = globalData.map(
									(x) => {
										return x.data["pointStyle"];
									}
								);
								targetDataset.pointHoverRadius = globalData.map(
									(x) => {
										return x.data["pointHoverRadius"];
									}
								);
								chartRef.current.update();
							}
							chartRef.current.show(index);
						}
					}
				},
			},
			tooltip: {
				backgroundColor: "rgba(255,255,255, 0.9)",
				titleMarginBottom: 10,
				titleColor: "#000",
				titleFontSize: 5,
				titleAlign: "center",
				bodyAlign: "center",
				bodyColor: "#000",
				bodyFont: {
					size: 12,
					family: "trebuchet",
					weight: "bold",
				},
				borderColor: "#dddfeb",
				borderWidth: 2,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				intersect: true,
				mode: "index",
				caretPadding: 10,
				padding: 10,
				callbacks: {
					title: (context) => {
						const d = new Date(context[0].parsed.x);
						const formatedDate = d.toLocaleString([], {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						});
						return formatedDate;
					},
					label: (context) => {
						if (context.formattedValue == "0") {
							return "";
						}
						return undefined;
					},
					labelTextColor: (context) => {
						if (context.dataset.label == "Glucose") {
							return "#4e73df";
						} else if (
							context.dataset.label == "Correction Bolus"
						) {
							return "#ba03fc";
						} else {
							return "#df4e8a";
						}
					},
				},
			},
			tagsLabelsMarkers: {
				datetime: 1,
				data: tagsData,
			},
		},
	};

	const findMaxValue = (data) => {
		let maxValue = 0;
		if (data.length) {
			data.forEach((element) => {
				if (element.data.glucose > maxValue) {
					maxValue = element.data.glucose;
				}
			});
		}
		return maxValue === 0 ? 400 : maxValue + 50;
	};

	useEffect(() => {
		let period = 48;
		let defaultConfig = {
			glucose: true,
			basal: true,
			meal: true,
			correction: true,
		};
		let config = JSON.parse(
			window.localStorage.getItem("defaultChartSettings")
		);
		if (config) {
			if (config["period"]) {
				period = parseInt(config["period"]);
			}
			if (config["types"]) {
				defaultConfig = config["types"];
			}
		}
		setDataState(defaultConfig);
		const getData = async () => {
			title.current = "Chart for last " + period + "h data:";
			let response = await getLastXhData(parseInt(period));
			let holes = await checkMissingData();
			let dataStructure = useCreateDataStructureHomeChart(response);

			setDataHoles(holes);
			setMaxGlucoseValue(findMaxValue(dataStructure));
			setGlobalData(dataStructure);
		};
		getData();
	}, [props.reloadProps]);

	useEffect(() => {
		const postProcess = async () => {
			let dates = {
				first: "",
				last: "",
			};
			if (globalData[0]) {
				if (globalData[0].datetime) {
					dates["first"] = globalData[0].datetime;
				}
				if (globalData.slice(-1)) {
					dates["last"] = globalData.slice(-1)[0].datetime;
				}
				props.setDates(dates);
				setStartDate(dates["first"]);
				setEndDate(dates["last"]);
				processBarWidth(dates["first"], dates["last"]);
				let tagsRes = await getTagsInRange(
					dates["first"],
					dates["last"]
				);
				setTagsData(tagsRes);
				// console.log(tagsRes);
				setFilteredDataHoles(
					dataHoles.filter((element) => {
						return (
							new Date(element.start) >=
								new Date(dates["first"]) &&
							new Date(element.end) <= new Date(dates["last"])
						);
					})
				);
			}
		};
		postProcess();
	}, [globalData, props.reloadProps]);

	return (
		<div
			className="w-100 overflow-visible"
			// style={{ maxWidth: "80%" }}
		>
			<Chart
				type="line"
				ref={chartRef}
				options={options}
				data={data}
				plugins={[
					legendMargin,
					// tagsLabels,
					tagsLabelsMarkers,
				]}
			/>
		</div>
	);
};

export default DefaultHomeChart;
