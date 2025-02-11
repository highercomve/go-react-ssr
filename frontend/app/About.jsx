import React from "react";
import { hydrateRoot } from "react-dom/client";
import { About } from "../components/About";

const root = document.getElementById("react-app");
const props = window.INITIAL_PROPS || {};
try {
	hydrateRoot(root, <About {...props} />);
} catch (error) {
	console.error("Root render failed:", error);
}
