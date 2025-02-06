import "./polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { PokemonDetail } from "../components/PokemonDetail";

function Render() {
	const props = { pokemon: globalThis.PROPS || {} };
	return renderToString(<PokemonDetail {...props} />);
}

globalThis.Render = Render;
