import React, { Component } from "react";
import { Link } from "react-router-dom";

/**
 *  This is the sidebar of the web application. Allows user to navigate between the different pages of the application
 */
class Sidebar extends Component {
	render() {
		return (
			<ul
				className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
				id="accordionSidebar"
			>
				{/* <!-- Sidebar - Brand --> */}
				<Link
					className="sidebar-brand d-flex align-items-center justify-content-center"
					to="/home"
				>
					<div className="sidebar-brand-icon">
						<i className="fas fa-chart-area" />
					</div>
					<div className="sidebar-brand-text mx-3">OMG Web</div>
				</Link>

				{/* <!-- Divider --> */}
				<hr className="sidebar-divider my-0" />

				{/* <!-- Nav Item - Home --> */}
				<li className="nav-item">
					<Link className="nav-link" to="/home">
						<i className="fas fa-fw fa-home" />
						<span>Home</span>
					</Link>
				</li>

				{/* <!-- Divider --> */}
				<hr className="sidebar-divider" />

				{/* <!-- Heading --> */}
				<div className="sidebar-heading">Charts</div>

				{/* <!-- Nav Item - Home --> */}
				<li className="nav-item">
					<Link className="nav-link" to="/chartsbytag">
						<i className="fas fa-fw fa-tag" />
						<span>By Tag</span>
					</Link>
				</li>

				{/* <!-- Divider --> */}
				<hr className="sidebar-divider" />

				{/* <!-- Heading --> */}
				<div className="sidebar-heading">Tools</div>

				{/* <!-- Nav Item - tag detection --> */}
				<li className="nav-item">
					<Link className="nav-link pb-2" to="/tagdetection">
						<i className="fas fa-fw fa-indent" />
						<span>Tag detection</span>
					</Link>
				</li>

				{/* <!-- Nav Item - pending tags --> */}
				<li className="nav-item">
					<Link className="nav-link pt-2 pb-2" to="/pendingtags">
						<i className="fas fa-fw fa-clock" />
						<span>Pending tags</span>
					</Link>
				</li>

				{/* <!-- Nav Item - tag activation --> */}
				<li className="nav-item">
					<Link className="nav-link pt-2 pb-2" to="/tagactivation">
						<i className="fas fa-fw fa-plus-circle" />
						<span>Tag creation</span>
					</Link>
				</li>

				{/* <!-- Nav Item - tag history --> */}
				<li className="nav-item">
					<Link className="nav-link pt-2 pb-2" to="/tagshistory">
						<i className="fas fa-fw fa-history" />
						<span>Tags history</span>
					</Link>
				</li>

				{/* <!-- Nav Item - upload data --> */}
				<li className="nav-item">
					<Link className="nav-link pt-2" to="/import">
						<i className="fas fa-fw fa-file-upload" />
						<span>Import data</span>
					</Link>
				</li>

				{/* <!-- Divider --> */}
				<hr className="sidebar-divider" />

				{/* <!-- Heading --> */}
				<div className="sidebar-heading">Manage</div>
				{/* <!-- Nav Item - manage data --> */}
				<li className="nav-item">
					<Link className="nav-link pb-2" to="/dataManager">
						<i className="fas fa-fw fa-database" />
						<span>Data</span>
					</Link>
				</li>

				{/* <!-- Nav Item - manage tags --> */}
				<li className="nav-item">
					<Link className="nav-link pt-2" to="/tagsManager">
						<i className="fas fa-fw fa-tags" />
						<span>Tags</span>
					</Link>
				</li>
			</ul>
		);
	}
}

export default Sidebar;
