import "./polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { PokemonList } from "../components/PokemonList";

function Render() {
	const props = globalThis.PROPS || {};
	return renderToString(<PokemonList {...props} />);
}

globalThis.Render = Render;
