import React from "react";
import { createRoot } from "react-dom/client";
import { PokemonList } from "../components/PokemonList";

const container = document.getElementById("react-app");
if (container) {
	const root = createRoot(container);
	const props = (window as any).INITIAL_PROPS || {};
	try {
		root.render(<PokemonList {...props} />);
	} catch (error) {
		console.error("Root render failed:", error);
	}
} else {
	console.error("React app container not found");
}
