import {
	Chart,
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
} from "chart.js";
import { useRef, useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { getLast24hData } from "../../../services/omgServer";

const DefaultHomeChart = (props) => {
	const [dataSet, setDataSet] = useState([]);
	const [labels, setLabels] = useState([]);
	// const [dataType, setDataType] = useState([]);

	const lableTitle = useRef("Glucose Level");
	const pointsRadius = useRef(0);
	const title = useRef("Glucose level for last 24h");

	Chart.register([
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
	]);

	const data = {
		labels: labels,
		datasets: [
			{
				label: lableTitle.current,
				data: dataSet,
				borderColor: "#4e73df",
				backgroundColor: "#ffff",
				tension: 0,
				borderWidth: 2,
				pointRadius: pointsRadius.current,
				fill: false,
				pointBackgroundColor: "white",
				pointBorderColor: "lightblue",
				pointHoverRadius: 8,
				pointHoverBackgroundColor: "#4e73df",
				pointHoverBorderColor: "rgba(255, 255, 255, 0.4)",
				pointHoverBorderWidth: 3,
				pointHitRadius: 5,
				pointBorderWidth: 2,
				spanGaps: false,
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
			},
		},
		responsive: true,
		plugins: {
			title: {
				display: true,
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
				text: "Test",
			},
			tooltip: {
				backgroundColor: "rgba(255,255,255, 0.9)",
				bodyColor: "#858796",
				titleMarginBottom: 10,
				titleColor: "#000",
				titleFontSize: 5,
				titleAlign: "center",
				bodyAlign: "center",
				bodyColor: "#4e73df",
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
				intersect: false,
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
							hour12: true,
						});
						// console.log(formatedDate);
						return formatedDate;
					},
				},
			},
		},
	};

	useEffect(() => {
		let period = 24;
		let dataType = "glucose";
		let config = JSON.parse(
			window.localStorage.getItem("defaultChartSettings")
		);
		if (config) {
			period = parseInt(config["period"]);
			dataType = config["type"];
		} else {
			// Si il n'y a pas de configuration détectée, on affiche le graph de glycémie par défaut
			dataType = "glucose";
		}
		const getData = async () => {
			console.log(period);
			let response = await getLast24hData(parseInt(period));
			console.log(response);
			let dataToDisplay = [];
			if (dataType == "glucose") {
				setDataSet(response["GlucoseData"].map((x) => x.glucose));
				setLabels(response["GlucoseData"].map((x) => x.datetime));
				title.current = "Glucose level for last " + period + "H";
				lableTitle.current = "Glucose Level";
				pointsRadius.current = 0;
			} else if (dataType == "correction") {
				dataToDisplay = response["InsulinData"]
					.filter((x) => {
						return x.insulinType == "CORRECTION";
					})
					.sort((a, b) => {
						return new Date(a.datetime) - new Date(b.datetime);
					});
				setDataSet(
					dataToDisplay.map((x) => {
						return JSON.parse(x.insulinDescr)[
							"deliveredFastAmount"
						];
					})
				);
				setLabels(dataToDisplay.map((x) => x.datetime));
				lableTitle.current = "Correction Bolus";
				title.current = "Correction bolus for last " + period + "H";
			} else if (dataType == "meal") {
				dataToDisplay = response["InsulinData"]
					.filter((x) => {
						return x.insulinType == "MEAL";
					})
					.sort((a, b) => {
						return new Date(a.datetime) - new Date(b.datetime);
					});
				setDataSet(dataToDisplay.map((x) => x.carbInput));
				setLabels(dataToDisplay.map((x) => x.datetime));
				pointsRadius.current = 5;
				lableTitle.current = "Meal Bolus";
				title.current = "Meal bolus for last " + period + "H";
			} else if (dataType == "basal") {
				dataToDisplay = response["InsulinData"]
					.filter((x) => {
						return x.insulinType == "AUTO_BASAL_DELIVERY";
					})
					.sort((a, b) => {
						return new Date(a.datetime) - new Date(b.datetime);
					});
				setDataSet(
					dataToDisplay.map((x) => {
						return JSON.parse(x.insulinDescr)["bolusAmount"];
					})
				);
				setLabels(dataToDisplay.map((x) => x.datetime));
				pointsRadius.current = 2;
				lableTitle.current = "Basal Bolus";
				title.current = "Basal level for last " + period + "H";
			}
		};
		getData();
	}, [props.reloadProps]);

	return (
		<div
			style={{ width: "70%", overflow: "visible" }}
			className="position-relative"
		>
			<Line options={options} data={data} />
			{dataSet[0] ? (
				""
			) : (
				<div className="d-flex flex-column justify-content-center align-items-center w-100 h-100 position-absolute top-0 start-0">
					<h3 className="p-2 border border-danger bg-light fs-5 fw-bolder text-danger">
						No data to display
					</h3>
					<p className="text-dark text-center fw-bold ">
						No datas were detected, sometimes auto-import takes some
						time to retrieve datas. Reloading the page after a few
						seconds might do the trick.
					</p>
				</div>
			)}
		</div>
	);
};

export default DefaultHomeChart;
