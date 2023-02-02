import React, { Component } from "react";
import { signup } from "../services/omgServer";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";

class SignUp extends Component {
	static propTypes = {
		cookies: instanceOf(Cookies).isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastname: "",
			email: "",
			password: "",
			confirmPassword: "",
			error: "",
			messageApi: "",
			showSmallButtons: true,
			secret: "",
		};
	}

	componentDidMount() {
		document.getElementById("body").className = "bg-gradient-primary";
	}

	handleSignUp = async () => {
		this.setState({ error: "" });
		this.removeDangerInput([
			"inputFirstName",
			"inputLastName",
			"inputEmail",
			"inputPassword",
			"inputConfirmPassword",
		]);
		if (this.state.secret !== "createAccount2121") {
			this.dangerInput(["inputSecret"]);
			await this.setState({ error: "Wrong secret" });
		}
		if (this.state.password !== this.state.confirmPassword) {
			this.dangerInput(["inputPassword", "inputConfirmPassword"]);
			await this.setState({ error: "Passwords must match" });
		} else {
			if (this.state.password.length < 8) {
				this.dangerInput(["inputPassword", "inputConfirmPassword"]);
				await this.setState({
					error: "Password must be at least 8 characters long",
				});
			}
		}
		if (!this.isValidEmail(this.state.email)) {
			this.dangerInput(["inputEmail"]);
			await this.setState({ error: "Incorrect email" });
		}
		if (!this.isValidName(this.state.firstName)) {
			this.dangerInput(["inputFirstName"]);
			await this.setState({
				error: "You can't use special characters for names",
			});
		}
		if (!this.isValidName(this.state.lastName)) {
			this.dangerInput(["inputLastName"]);
			await this.setState({
				error: "You can't use special characters for names",
			});
		}
		if (!this.state.error) {
			document
				.getElementById("btnSignUp")
				.classList.remove("btn-primary");
			document
				.getElementById("btnSignUp")
				.setAttribute("disabled", "true");
			document.getElementById("btnSignUp").classList.add("btn-secondary");
			let response = await signup({
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				password: this.state.password,
			});
			console.log(response);
			if (response.status === "ok") {
				this.setState({
					messageApi: response.message,
					showSmallButtons: false,
				});
			}
			if (response.status === "error") {
				this.setState({ error: response.message });
				document
					.getElementById("btnSignUp")
					.classList.remove("btn-secondary");
				document
					.getElementById("btnSignUp")
					.removeAttribute("disabled");
			}
		}
	};

	dangerInput(inputs) {
		for (let input of inputs) {
			document.getElementById(input).classList.add("border-danger");
		}
	}

	removeDangerInput(inputs) {
		for (let input of inputs) {
			document.getElementById(input).classList.remove("border-danger");
		}
	}

	showError() {
		let message = "";
		if (this.state.error !== "") {
			document.getElementById("horizLine").classList.remove("mt-4");
			document.getElementById("horizLine").classList.add("mt-0");
			message = (
				<div className="text-danger d-flex justify-content-center mt-3 mb-0">
					<p>{this.state.error}</p>
				</div>
			);
		}
		return message;
	}

	showSuccess() {
		let message = "";
		if (this.state.messageApi !== "") {
			document.getElementById("horizLine").classList.remove("mt-4");
			document.getElementById("horizLine").classList.add("mt-0");
			message = (
				<div className="text-success d-flex justify-content-center mt-3 mb-0">
					<p>{this.state.messageApi}</p>
				</div>
			);
		}
		return message;
	}

	isValidName(name) {
		let re =
			/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
		return re.test(String(name).toLowerCase());
	}

	isValidEmail(email) {
		let re =
			/^(([^<>()q[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	showSmallButtons() {
		if (this.state.showSmallButtons) {
			return (
				<div
					id="smallButtons"
					className="row justify-content-center flex-column"
				>
					<div className="text-center">
						<button className="btn btn-link disabled">
							Forgot Password?
						</button>
					</div>
					<div className="text-center">
						<button
							className="btn btn-link"
							onClick={this.toSignIn}
						>
							Already an account ? Sign in!
						</button>
					</div>
				</div>
			);
		} else {
			return (
				<div
					id="smallButtons"
					className="row justify-content-center flex-column"
				>
					<div className="text-center">
						<button
							className="btn btn-primary"
							onClick={this.toSignIn}
						>
							Sign in !
						</button>
					</div>
				</div>
			);
		}
	}

	setFirstName = (event) => this.setState({ firstName: event.target.value });
	setLastName = (event) => this.setState({ lastName: event.target.value });
	setEmail = (event) => this.setState({ email: event.target.value });
	setPassword = (event) => this.setState({ password: event.target.value });
	setSecret = (event) => this.setState({ secret: event.target.value });
	setConfirmPassword = (event) =>
		this.setState({ confirmPassword: event.target.value });
	toSignIn = async () => await this.setCookie("method", "in");

	render() {
		return (
			<div className={"col-12"}>
				<div id="wrapper d-sm-flex flex-column">
					<div className="d-flex flex-row align-items-center ms-4 mt-4">
						<i className="fas fa-chart-area fa-4x text-white mb-1" />
						<div className="h1 text-white fw-bold ms-3 mb-0">
							OMG Web
						</div>
					</div>
					{/* <!-- Outer Row --> */}
					<div className="d-flex justify-content-center">
						<div className="card o-hidden border-0 shadow-lg mt-5 ms-2 me-2 mb-2">
							<div className="card-body">
								{/* <!-- Nested Row within Card Body --> */}
								<div className="p-3">
									<div className="row justify-content-center flex-column">
										<h1 className="h3 text-gray-900 mb-4">
											Create an account
										</h1>
										<div className="user justify-content-center">
											<div className="form-group d-flex flex-row">
												<input
													type="text"
													className="form-control form-control-user"
													id="inputFirstName"
													aria-describedby="firstName"
													placeholder="First name"
													onChange={this.setFirstName}
												/>
												<input
													type="text"
													className="form-control form-control-user ms-2"
													id="inputLastName"
													aria-describedby="lastName"
													placeholder="Last name"
													onChange={this.setLastName}
												/>
											</div>
											<div className="form-group">
												<input
													type="email"
													className="form-control form-control-user"
													id="inputEmail"
													aria-describedby="emailHelp"
													placeholder="Email"
													onChange={this.setEmail}
												/>
											</div>
											<div
												id="formGroupPassword"
												className="form-group d-flex flex-row"
											>
												<input
													type="password"
													className="form-control form-control-user"
													id="inputPassword"
													placeholder="Password"
													onChange={this.setPassword}
												/>
												<input
													type="password"
													className="form-control form-control-user ms-2"
													id="inputConfirmPassword"
													placeholder="Confirm password"
													onChange={
														this.setConfirmPassword
													}
												/>
											</div>
											<div
												id="formGroupSecret"
												className="form-group d-flex flex-row"
											>
												<input
													type="password"
													className="form-control form-control-user"
													id="inputSecret"
													placeholder="Secret"
													onChange={this.setSecret}
												/>
											</div>
											<button
												id="btnSignUp"
												className="btn btn-primary btn-user btn-block"
												onClick={this.handleSignUp}
											>
												Sign up
											</button>
											{this.showError()}
											{this.showSuccess()}
										</div>
									</div>
									<hr id="horizLine" className="mt-4" />
									{this.showSmallButtons()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	getCookie = (name) => {
		return this.props.cookies.get(name);
	};

	setCookie = (name, key) => {
		this.props.cookies.set(name, key);
	};
}

export default withCookies(SignUp);
