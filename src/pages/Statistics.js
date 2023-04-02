import { useState } from "react";
import IndicatorBar from "../components/StatsComponents/indicatorBar";

const Statistics = () => {
	const [pageState, setPageState] = useState(0);

	const renderPage = () => {
		switch (pageState) {
			case 0:
				return (
					<div>
						<h4 className="text-primary">Average Glucose Level </h4>
						<div className="" style={{ width: "350px" }}>
							<IndicatorBar
								min={80}
								max={190}
								actualPosition={120}
							/>
						</div>
					</div>
				);
			case 1:
				return (
					<div>
						<h4 className="text-primary">
							Statistics about Insulin
						</h4>
					</div>
				);
			case 2:
				return (
					<div>
						<h4 className="text-primary">
							Statistics about Sugar Admission
						</h4>
						<div className="" style={{ width: "350px" }}>
							<IndicatorBar
								min={80}
								max={190}
								actualPosition={120}
							/>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="container-fluid">
			<div>
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a
							className="nav-link active"
							href=""
							onClick={() => {
								setPageState(0);
							}}
						>
							Glucose
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link"
							href=""
							onClick={() => {
								setPageState(1);
							}}
						>
							Insulin
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link"
							href=""
							onClick={() => {
								setPageState(2);
							}}
						>
							Sugar Administration
						</a>
					</li>
				</ul>
			</div>
			<div className="border-start border-bottom border-end p-4">
				{renderPage()}
			</div>
		</div>
	);
};

export default Statistics;
