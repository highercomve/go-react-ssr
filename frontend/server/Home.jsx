// import "./polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderToJSON } from "../lib/rsc.helpers.jsx";
import { Home } from "../components/Home.jsx";

function HomeServer() {
	return <Home {...globalThis.PROPS} />;
}

globalThis.Render = () => {
	return renderToString(<HomeServer />);
};

globalThis.RenderRSC = () => {
	return renderToJSON(<HomeServer />);
};
