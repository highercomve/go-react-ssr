import "./polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderToJSON } from "../lib/rsc.helpers";
import { About } from "../components/About";

globalThis.Render = () => {
	const props = globalThis.PROPS || {};
	return renderToString(<About {...props} />);
};

globalThis.RenderRSC = async () => {
	const props = globalThis.PROPS || {};
	const element = <About {...props} />;
	return await renderToJSON(element);
};
