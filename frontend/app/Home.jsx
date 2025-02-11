import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Home } from "../components/Home";

const root = document.getElementById("react-app");
const props = window.INITIAL_PROPS || {};
try {
	hydrateRoot(root, <Home {...props} />);
} catch (error) {
	console.error("Root render failed:", error);
}
