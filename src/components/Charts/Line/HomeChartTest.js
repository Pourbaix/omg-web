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
import { getLastXhData } from "../../../services/omgServer";
import { useCreateDataStructureHomeChart } from "../../../hooks/useCreateDataStructure";
import Meal from "../../../assets/meal.svg";

const DefaultHomeChart = (props) => {
	const [globalData, setGlobalData] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [barWidth, setBarWidth] = useState(4);

	const chartRef = useRef(null);

	const [dataState, setDataState] = useState({
		glucose: true,
		meal: true,
		basal: true,
		correction: true,
	});

	// const lableTitle = useRef("Glucose Level");
	// const pointsRadius = useRef(0);
	const title = useRef("Chart for last 24h data");

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

	const processBarWidth = () => {
		let currentMsDisplayed =
			new Date(endDate).getTime() - new Date(startDate).getTime();
		console.log(currentMsDisplayed / 3600000);
		let currentHoursDisplayed = currentMsDisplayed / 3600000;
		if (currentHoursDisplayed) {
			setBarWidth(52 / currentHoursDisplayed);
		}
	};

	let data = {
		datasets: [
			{
				type: "line",
				label: "Glucose",
				data: globalData,
				borderColor: "#4e73df",
				backgroundColor: "#4e73df",
				tension: 0,
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
		],
	};

	const options = {
		scales: {
			x: {
				type: "time",
			},
			y: {
				beginAtZero: true,
				type: "linear",
				position: "left",
			},
			basal: {
				beginAtZero: true,
				type: "linear",
				position: "right",
				max: 0.3,
				display: false,
				reverse: false,
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
					font: {
						family: '"Gill-sans", sans-serif',
						weight: "500",
						size: "12px",
					},
					generateLabels: (chart) => {
						// console.log("-----------CHART:-------------");
						// console.log(chart);
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
					// console.log(click);
					// console.log(legendItem);
					// console.log(legend);
					if (needsToBeDisplayed(legendItem.text)) {
						const datasets = legend.legendItems.map(
							(dataset, index) => {
								return dataset.text;
							}
						);

						const index = datasets.indexOf(legendItem.text);
						// console.log(index);
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
							// console.log(
							// 	chartRef.current["legend"].legendItems[index]
							// 		.fontColor
							// );
							chartRef.current.legend.update();
							chartRef.current.update();
							// console.log(chartRef.current);
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
						} else {
							return "#df4e8a";
						}
					},
				},
			},
		},
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
			setGlobalData(useCreateDataStructureHomeChart(response));
		};
		getData();
	}, [props.reloadProps]);

	useEffect(() => {
		// console.log(globalData);
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
			processBarWidth();
		}
	}, [globalData, props.reloadProps]);

	return (
		<div
			className="position-relative w-100 overflow-visible"
			style={{ maxWidth: "800px" }}
		>
			<Chart type="line" ref={chartRef} options={options} data={data} />
		</div>
	);
};

export default DefaultHomeChart;
