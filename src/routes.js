import React, { Component } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { instanceOf } from "prop-types";
import { Cookies, withCookies } from "react-cookie";

import Sidebar from "./components/Navigation/Sidebar";
import Topbar from "./components/Navigation/Topbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

//Pages
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Import from "./pages/Import";
import ChartsByTag from "./pages/ChartsByTag";
import DataManager from "./pages/DataManager";
import store from "./redux/store";
import { verifyToken } from "./services/omgServer";
import TagsManager from "./pages/TagsManager";
import Bottombar from "./components/Navigation/Bottombar";
import TagActivation from "./pages/TagActivation";
import TagsHistory from "./pages/TagHistory";
import TagDetection from "./pages/TagDetection";
import PendingTags from "./pages/PendingTags";
import LoadingPage from "./pages/LoadingPage";

/**
 * Routing component. Manage authentification too.
 * @return BrowserRouter
 */
class RoutesList extends Component {
	static propTypes = {
		cookies: instanceOf(Cookies).isRequired,
	};

	constructor(props) {
		super(props);
		this.setCookie("method", "in");
		// document.getElementById('body').style.backgroundColor = "#f8f9fc"
		this.state = {
			requestLoading: 0,
			requestOk: false,
		};
	}

	checkMobile() {
		let check = false;
		(function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				check = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		return check;
	}

	showAuth() {
		if (this.getCookie("method")) {
			// returns the appropriate authentication page based on the method registered in the redux store
			if (this.getCookie("method") === "in") {
				return <SignIn />;
			}
			if (this.getCookie("method") === "up") {
				return <SignUp />;
			}
		}
	}

	testKey() {
		let apiKey = this.getCookie("apiKey");
		store.dispatch({ type: "SETKEY", value: apiKey });
		verifyToken().then((res) => {
			this.setState({ requestOk: res.ok });
			this.setState({ requestLoading: 2 });
		});
	}

	isConnected = () => {
		switch (this.state.requestLoading) {
			case 0:
				console.log(0);
				if (this.getCookie("apiKey")) {
					console.log(10);
					if (this.getCookie("apiKey").includes("ey")) {
						console.log(110);
						if (
							store.getState().storeApiKey.apiKey ===
							this.getCookie("apiKey")
						) {
							console.log(1110);
							return this.showRouter();
						} else {
							console.log(-1110);
							this.testKey();
							this.setState({ requestLoading: 1 });
						}
					} else {
						console.log(-110);
						return this.showAuth();
					}
				} else {
					console.log(-10);
					return this.showAuth();
				}
				break;
			case 1:
				console.log(1);
				return <p>Loading...</p>;
			case 2:
				console.log(2);
				if (this.state.requestOk) {
					this.setState({ requestLoading: 0 });
					return this.showRouter();
				} else {
					this.setState({ requestLoading: 0 });
					return this.showAuth();
				}
			default:
				break;
		}
	};

	showRouter() {
		return (
			<div>
				{/* <!-- Page Wrapper --> */}
				<div id="wrapper">
					{/* <!-- Sidebar --> */}
					{this.checkMobile() ? <div /> : <Sidebar />}
					{/* <!-- End of Sidebar --> */}
					{/* <!-- Content Wrapper --> */}
					<div id="content-wrapper" className="d-flex flex-column">
						{/* <!-- Main Content --> */}
						<div id="content">
							{/* <!-- Topbar --> */}
							<Topbar />
							{/* <!-- End of Topbar --> */}
							{/* <!-- Router switch --> */}
							<div className="row">
								{/* <Navigate to="/index" replace={true} /> */}
								<Routes>
									<Route
										index
										path="/"
										element={<LoadingPage />}
									/>
									<Route path="/home" element={<Home />} />
									<Route
										path="/datamanager"
										element={<DataManager />}
									/>
									<Route
										path="/tagsmanager"
										element={<TagsManager />}
									/>
									<Route
										path="/tagactivation"
										element={<TagActivation />}
									/>
									<Route
										path="/tagshistory"
										element={<TagsHistory />}
									/>
									<Route
										path="/import"
										element={<Import />}
									/>
									<Route
										path="/chartsbytag"
										element={<ChartsByTag />}
									/>
									<Route
										path="/tagdetection"
										element={<TagDetection />}
									/>
									<Route
										path="/pendingtags"
										element={<PendingTags />}
									/>
									<Route path="*" element={<NotFound />} />
								</Routes>
							</div>
							{/* <!-- End of Router switch --> */}
						</div>
						{/* <!-- End of Main Content --> */}
						{/* <!-- Footer --> */}
						{this.showFooter()}
						{/* <!-- End of Footer --> */}
					</div>
					{/* <!-- End of Content Wrapper --> */}
				</div>
				{/* <!-- End of Page Wrapper --> */}
			</div>
		);
	}

	showFooter() {
		if (this.checkMobile()) {
			return <Bottombar />;
		} else {
			return (
				<footer className="row sticky-footer bg-white">
					<div className="container my-auto">
						<div className="copyright text-center my-auto">
							<span>OMG web 2021</span>
						</div>
					</div>
				</footer>
			);
		}
	}

	render() {
		return <BrowserRouter>{this.isConnected()}</BrowserRouter>;
	}

	setCookie = (name, key) => {
		this.props.cookies.set(name, key);
	};

	getCookie = (name) => {
		return this.props.cookies.get(name);
	};
}

export default withCookies(RoutesList);
