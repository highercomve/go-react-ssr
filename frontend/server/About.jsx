import "./polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { About } from "../components/About";

function Render() {
	const props = globalThis.PROPS || {};
	return renderToString(<About {...props} />);
}

globalThis.Render = Render;
