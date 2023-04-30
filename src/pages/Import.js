import React, { Component } from "react";
import ImportFileCard from "../components/Cards/ImportFileCard";
import AutoImportFileCard from "../components/Cards/AutoImportFileCard";

/**
 * "web page" import data. It displays the different methods of importing user's data
 */
class Import extends Component {
	render() {
		return (
			<div
				className="container-fluid d-flex ms-2 me-2 flex-wrap"
				style={{ gap: "5px" }}
			>
				<ImportFileCard />
				<AutoImportFileCard />
			</div>
		);
	}
}

export default Import;
