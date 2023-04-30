import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";

class Bottombar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// tabs: [
			// 	{
			// 		route: "/tagshistory",
			// 		icon: "fa-history",
			// 		label: "History",
			// 	},
			// 	{
			// 		route: "/tagactivation",
			// 		icon: "fa-plus-circle",
			// 		label: "Create",
			// 	},
			// 	{
			// 		route: "/tagdetection",
			// 		icon: "fa-indent",
			// 		label: "Detect",
			// 	},
			// 	{
			// 		route: "/pendingtags",
			// 		icon: "fa-clock",
			// 		label: "Pending Tags",
			// 	},
			// 	{
			// 		route: "/tagsmanager",
			// 		icon: "fa-wrench",
			// 		label: "Manage",
			// 	},
			// ],
			tabs: [
				{
					route: "/home",
					icon: "fa-home",
					label: "Home",
					elements_list: [],
				},
				{
					icon: "fa-chart-line",
					label: "Visualize",
					elements_list: [
						{
							label: "Statistics",
							route: "/statistics",
						},
					],
				},
				{
					icon: "fa-tools",
					label: "Tools",
					elements_list: [
						{
							label: "Tag Detection",
							route: "/tagdetection",
						},
						{
							label: "Pending Tags",
							route: "/pendingtags",
						},
						{
							label: "Tag creation",
							route: "/tagactivation",
						},
						{
							label: "Tags history",
							route: "/tagshistory",
						},
						{
							label: "Import data",
							route: "/import",
						},
					],
				},
				{
					icon: "fa-database",
					label: "Manage",
					elements_list: [
						{
							label: "Data",
							route: "/datamanager",
						},
						{
							label: "Tags",
							route: "/tagsmanager",
						},
					],
				},
			],
		};
	}

	render() {
		return (
			<nav
				className="navbar-nav bg-primary navbar-expand navbar-dark fixed-bottom"
				role="navigation"
			>
				<Nav className="w-100 mt-2">
					<div className=" d-flex flex-row justify-content-around w-100">
						{this.state.tabs.map((tab, index) =>
							tab.route ? (
								<NavItem
									className={"nav-item"}
									key={`tab-${index}`}
								>
									<NavLink
										activeStyle={{
											fontWeight: "bold",
											color: "white",
										}}
										style={{ color: "#dddfeb" }}
										to={tab.route}
										className="nav-link"
										activeClassName="active"
									>
										<div className="d-flex flex-column justify-content-center align-items-center">
											<i
												className={
													"fas fa-lg fa-fw " +
													tab.icon
												}
											/>
											<div className={"small mt-1"}>
												{tab.label}
											</div>
										</div>
									</NavLink>
								</NavItem>
							) : (
								<div className="dropup">
									<button
										className="btn"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<div className="d-flex flex-column justify-content-center align-items-center">
											<i
												className={
													"text-white fas fa-lg fa-fw " +
													tab.icon
												}
											/>
											<div
												className={
													"small mt-1 text-white"
												}
											>
												{tab.label}
											</div>
										</div>
									</button>
									<ul className="dropdown-menu">
										{tab.elements_list.map(
											(element, element_index) => {
												return (
													<li>
														<NavItem
															className={
																"nav-item"
															}
															key={`tab-${index}-element-${element_index}`}
														>
															<NavLink
																activeStyle={{
																	fontWeight:
																		"bold",
																	color: "white",
																}}
																style={{
																	color: "rgba(0, 0, 0, 0.8)",
																}}
																to={
																	element.route
																}
																className="nav-link"
																activeClassName="active"
															>
																<div className="d-flex flex-column justify-content-center align-items-center">
																	<div
																		className={
																			" fs-6 mt-1"
																		}
																	>
																		<span className="text-primary">
																			▹
																		</span>
																		{
																			element.label
																		}
																	</div>
																</div>
															</NavLink>
														</NavItem>
													</li>
												);
											}
										)}
									</ul>
								</div>
							)
						)}
					</div>
				</Nav>
			</nav>
		);
	}
}

export default Bottombar;
