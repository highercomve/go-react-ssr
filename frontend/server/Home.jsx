import "./polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { Home } from "../components/Home";

function Render() {
	const props = globalThis.PROPS || {};
	return renderToString(<Home {...props} />);
}

globalThis.Render = Render;
