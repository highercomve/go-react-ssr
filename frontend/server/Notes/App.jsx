import "../polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderToJSON } from "../../lib/rsc.helpers";
import App from "../../components/notes/App";

globalThis.Render = () => {
	return renderToString(<App {...globalThis.PROPS} />);
};

globalThis.RenderRSC = async () => {
	return await renderToJSON(<App {...globalThis.PROPS} />);
};
