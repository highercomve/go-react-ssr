import React from "react";
import { createRoot } from "react-dom/client";
import { About } from "../components/About";

const root = createRoot(document.getElementById("react-app"));
const props = window.INITIAL_PROPS || {};
try {
	root.render(<About {...props} />);
} catch (error) {
	console.error("Root render failed:", error);
}
