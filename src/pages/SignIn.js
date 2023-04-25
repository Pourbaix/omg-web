import React, { Component, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { signin, autoImportData } from "../services/omgServer";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import store from "../redux/store";

const SignIn = (props) => {
	// static propTypes = {
	// 	cookies: instanceOf(Cookies).isRequired,
	// };

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		email: "",
	// 		password: "",
	// 		error: "",
	// 	};
	// }

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		document.getElementById("body").className = "bg-gradient-primary";
	}, []);

	const toSignUp = async () => {
		await setCookie("method", "up");
	};

	const handleSignIn = async () => {
		if (email !== "" && password !== "") {
			let res = await signin(email, password);
			if (res.status !== "ok") {
				setError(res.message);
			} else {
				let expiresDate = new Date(Date.now());
				expiresDate.setHours(expiresDate.getHours() + 2);
				await setCookie("apiKey", res.token, {
					expires: expiresDate,
				});
				await setApiKey(res.token);
				navigate("/");
				return <Navigate to="/" />;
			}
		} else {
			setError("Missing email and/or password");
		}
	};

	const showError = () => {
		let message = "";
		if (error !== "") {
			document.getElementById("horizLine").classList.remove("mt-4");
			document.getElementById("horizLine").classList.add("mt-0");
			message = (
				<div className="text-danger d-flex justify-content-center mt-3 mb-0">
					<p>{error}</p>
				</div>
			);
		}
		return message;
	};

	const handleSetEmail = (event) => setEmail(event.target.value);

	const handleSetPassword = (event) => setPassword(event.target.value);

	const setCookie = (name, key, options) => {
		props.cookies.set(name, key, options);
	};

	const setApiKey = async (apiKey) => {
		store.dispatch({ type: "SETKEY", value: apiKey });
	};

	return (
		<div className={"col-12"}>
			<div id="wrapper d-flex flex-column">
				<div className="d-flex flex-row align-items-center ms-4 mt-4">
					<i className="fas fa-chart-area fa-4x text-white mb-1" />
					<div className="h1 text-white fw-bold ms-3 mb-0">
						OMG Web
					</div>
				</div>
				{/* <!-- Outer Row --> */}
				<div className="d-flex justify-content-center">
					<div
						className="card o-hidden border-0 shadow-lg mt-5 ms-2 mr-2 mb-2"
						style={{ width: "20rem" }}
					>
						<div className="card-body">
							{/* <!-- Nested Row within Card Body --> */}
							<div className="p-3">
								<div className="row justify-content-center flex-column">
									<h1 className="h3 text-gray-900 mb-4">
										Sign in
									</h1>
									<div className="user">
										<div className="form-group">
											<input
												type="email"
												className="form-control form-control-user"
												id="exampleInputEmail"
												aria-describedby="emailHelp"
												placeholder="Email"
												onChange={handleSetEmail}
											/>
										</div>
										<div className="form-group">
											<input
												type="password"
												className="form-control form-control-user"
												id="exampleInputPassword"
												placeholder="Password"
												onChange={handleSetPassword}
											/>
										</div>
										<button
											className="btn btn-primary btn-user btn-block"
											onClick={handleSignIn}
											type={"submit"}
										>
											Login
										</button>
									</div>
								</div>
								{showError()}
								<hr id="horizLine" className="mt-4" />
								<div className="row justify-content-center flex-column">
									<div className="text-center">
										<button className="btn btn-link disabled">
											Forgot Password?
										</button>
									</div>
									<div className="text-center">
										<button
											className="btn btn-link"
											onClick={toSignUp}
										>
											Create an Account!
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withCookies(SignIn);
