import React, { Component } from "react";

/**
 * Home page of the web application
 */
class Home extends Component {
	render() {
		console.log("home");
		return (
			<div className="container-fluid">
				<div className="d-flex align-items-center justify-content-center">
					<h1 className="h1 mb-0 text-gray-800">
						Welcome to OMG Web application !
					</h1>
				</div>
			</div>
		);
	}
}

export default Home;
