import React from "react";
import { createRoot } from "react-dom/client";
import { Home } from "../components/Home";

const root = createRoot(document.getElementById("react-app"));
const props = window.INITIAL_PROPS || {};
try {
	root.render(<Home {...props} />);
} catch (error) {
	console.error("Root render failed:", error);
}
