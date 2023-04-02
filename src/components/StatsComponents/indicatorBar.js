import "../../styles/scss/stats/indicatorBar.scss";
import { useEffect, useRef, useState } from "react";

const IndicatorBar = (props) => {
	const [min, setMin] = useState(props.min ? props.min : 80);
	const [max, setMax] = useState(props.max ? props.max : 200);
	const [actualPosition, setActualPosition] = useState(
		props.actualPosition ? props.actualPosition : 0
	);
	const [calcPos, setCalcPos] = useState(0.0);

	const container = useRef(null);
	const indicator = useRef(null);

	useEffect(() => {
		setMin(props.min);
		setMax(props.max);
		setActualPosition(props.actualPosition);

		let dim1 = max - min;
		let totalLength = parseInt(getComputedStyle(container.current).width);
		let pannelWidth = parseInt(getComputedStyle(indicator.current).width);
		let pannelWidthPerc = (pannelWidth / totalLength) * 100;

		let m1 = parseFloat((totalLength / 100) * 60);
		let m2 = parseFloat((totalLength / 100) * 20);

		if (actualPosition <= max && actualPosition >= min) {
			// Position is in the center green part
			let base0Pos = actualPosition - min;
			let percentage = (base0Pos / dim1) * 100;

			let finalPos = (m1 / 100) * percentage + m2;

			let finalPosPercentage =
				parseFloat(((finalPos / totalLength) * 100).toFixed(2)) -
				pannelWidthPerc / 2 +
				"%";

			indicator.current.style.left = finalPosPercentage;
			indicator.current.style.color = "green";
		} else if (actualPosition > max) {
			// Position is in the right red part

			let maxlim = max + dim1 / 3;
			console.log("maxlim: ", maxlim);
			let finalPosPercentage = "0.0";
			if (actualPosition >= maxlim) {
				finalPosPercentage = 100.0 - pannelWidthPerc / 2 + "%";
			} else {
				// dim2 c'est la taille de la zone rouge de droite en % et dim2Px en px
				let dim2 = 20;
				let dim2Px = (totalLength / 100) * dim2;

				let posPercWithDim2 = (actualPosition - max) / (maxlim - max);
				let posWithDim2Px = dim2Px * posPercWithDim2;
				let finalPosPx = (totalLength / 100) * 80 + posWithDim2Px;
				finalPosPercentage =
					(
						(finalPosPx / totalLength) * 100 -
						pannelWidthPerc / 2
					).toFixed(2) + "%";
			}
			indicator.current.style.left = finalPosPercentage;
			indicator.current.style.color = "red";
		} else if (actualPosition < min) {
			// Position is in the left red part
			let minlim = min - dim1 / 3;
			console.log("minlim: ", minlim);
			let finalPosPercentage = "0.0";
			if (actualPosition <= minlim) {
				finalPosPercentage = 0.0 - pannelWidthPerc / 2 + "%";
			} else {
				let dim2 = 20;
				let dim2Px = (totalLength / 100) * dim2;

				let posPercWithDim2 =
					(actualPosition - minlim) / (min - minlim);
				let posWithDim2Px = dim2Px * posPercWithDim2;
				finalPosPercentage =
					(
						(posWithDim2Px / totalLength) * 100 -
						pannelWidthPerc / 2
					).toFixed(2) + "%";
			}
			indicator.current.style.left = finalPosPercentage;
			indicator.current.style.color = "red";
		}
	}, [actualPosition]);

	return (
		<div className="w-100">
			<div className="indicator_wrapper">
				<div className="actual_position_indicator" ref={indicator}>
					{actualPosition}
				</div>
				<div className="indicator_container" ref={container}>
					<div className="indicator_background"></div>
					<div
						className="indicator_separator"
						style={{ left: "20%" }}
					></div>
					<div className="indicator_front"></div>
					<div
						className="indicator_separator"
						style={{ left: "80%" }}
					></div>
				</div>
				<p className="indicator min">{min}</p>
				<p className="indicator max">{max}</p>
			</div>
		</div>
	);
};

export default IndicatorBar;
