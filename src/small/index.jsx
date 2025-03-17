import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App1 from "./f0";
import "./index.css";

const App2 = React.lazy(() => import("./f1"));
const App3 = React.lazy(() => import("./f2"));
const App4 = React.lazy(() => import("./f3"));

ReactDom.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App1 />
			<React.Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/f1" element={<App2 />} />
					<Route path="/f2" element={<App3 />} />
					<Route path="/f3" element={<App4 />} />
				</Routes>
			</React.Suspense>
		</BrowserRouter>
	</React.StrictMode>
);
