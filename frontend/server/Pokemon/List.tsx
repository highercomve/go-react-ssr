import "../polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { Pokemons } from "../../components/Pokemon/App";
import { renderToJSON } from "../../lib/rsc.helpers";

globalThis.Render = () => {
	const props = globalThis.PROPS || {};
	return renderToString(<Pokemons {...props} />);
};

globalThis.RenderRSC = async () => {
	const props = globalThis.PROPS || {};
	const element = <Pokemons {...props} />;
	return await renderToJSON(element);
};
