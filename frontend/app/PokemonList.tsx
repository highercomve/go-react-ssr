import React from "react";
import { hydrateRoot } from "react-dom/client";
import { PokemonList } from "../components/PokemonList";
import { PokemonApiResponse } from "../lib/models";

const container = document.getElementById("react-app");
if (container) {
	const props: PokemonApiResponse = (window as any).INITIAL_PROPS || {};
	try {
		hydrateRoot(container, <PokemonList {...props} />);
	} catch (error) {
		console.error("Root render failed:", error);
	}
} else {
	console.error("React app container not found");
}
