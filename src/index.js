import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CookiesProvider } from "react-cookie";
import { createRoot } from "react-dom/client";

//SBAdmin2 Style
import "./styles/scss/sb-admin-2.scss";

import "bootstrap/dist/js/bootstrap.bundle.min";

//Redux
import { Provider } from "react-redux";
import Store from "./redux/store";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
	<CookiesProvider>
		<Provider store={Store}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</Provider>
	</CookiesProvider>
);
