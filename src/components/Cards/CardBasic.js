import React, { Component } from "react";

/**
 * basic card component inspired of the SB Admin 2 theme
 */
class CardBasic extends Component {
	setClassName = () => {
		let borderBottom = this.props.color
			? "border-bottom-" + this.props.color
			: "border-bottom-primary";
		return "card shadow mb-4 me-3 " + borderBottom;
	};

	render() {
		return (
			<div id={"basicCardComponent"} className={this.setClassName()}>
				<div className="card-body">{this.props.children}</div>
			</div>
		);
	}
}

export default CardBasic;
