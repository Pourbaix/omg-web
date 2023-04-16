import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { Cookies, withCookies } from "react-cookie";
import store from "../../redux/store";

/**
 * This is the topbar of the web application. Allows user to access the application and account settings
 */
class Topbar extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		cookies: instanceOf(Cookies).isRequired,
	};

	logout() {
		store.dispatch({ type: "SETKEY", value: "" });
		this.setCookie("apiKey", "");
		window.location = window.location.origin;
	}

	setTitle() {
		let routesDict = {
			"/": "Home",
			"/home": "Home",
			"/dataManager": "Data Manager",
			"/tagsManager": "Tags Manager",
			"/tagactivation": "Tag Creation",
			"/tagshistory": "History",
			"/import": "Import Data",
			"/tagdetection": "Tag Detection",
			"/chartsbytag": "Charts by tag",
			"/pendingtags": "Pending Tags",
		};
		// console.log(window.location);
		if (routesDict.hasOwnProperty(window.location.pathname)) {
			// console.log(routesDict.hasOwnProperty(window.location.pathname));
			return (
				<p id={"topbarTitle"} className={"navbar-brand mb-0"}>
					{routesDict[window.location.pathname]}
				</p>
			);
		} else {
			return <p id={"topbarTitle"} className={"navbar-brand mb-0"} />;
		}
	}

	render() {
		return (
			<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
				{/* <!-- Topbar Navbar --> */}
				<div>{this.setTitle()}</div>

				<ul className="navbar-nav ms-auto">
					<div className="topbar-divider me-0 d-sm-block" />
					{/* <!-- Nav Item - User Information --> */}
					<li className="nav-item dropdown no-arrow ">
						<div
							className="nav-link dropdown-toggle"
							id="userDropdown"
							role="button"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<span
								className="me-2 d-lg-inline text-gray-600"
								onClick={() => this.logout()}
							>
								User
							</span>
							{/*<img className="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" alt="user"/>*/}
							<i className="fas fa-2x fa-fw fa-user-circle" />
						</div>
						{/* <!-- Dropdown - User Information --> */}
						<div
							className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
							aria-labelledby="userDropdown"
						>
							<div className="dropdown-item">
								<i className="fas fa-user fa-sm fa-fw me-2 text-gray-400" />
								Profile
							</div>
							<div className="dropdown-item">
								<i className="fas fa-cogs fa-sm fa-fw me-2 text-gray-400" />
								Settings
							</div>
							<div className="dropdown-divider" />
							<button
								className="dropdown-item"
								data-toggle="modal"
								data-target="#logoutModal"
								onClick={() => {
									this.logout();
								}}
							>
								<i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />
								Logout
							</button>
						</div>
					</li>
				</ul>
			</nav>
		);
	}

	getCookie = (name) => {
		return this.props.cookies.get(name);
	};

	setCookie = (name, key) => {
		this.props.cookies.set(name, key);
	};
}

export default withCookies(Topbar);
