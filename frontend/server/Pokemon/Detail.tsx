import "../polyfill";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderToJSON } from "../../lib/rsc.helpers";
import { PokemonDetail } from "../../components/Pokemon/Detail";

function Component() {
	return <PokemonDetail pokemon={globalThis.PROPS}/>
}

globalThis.Render = () => {
	return renderToString(<Component />);
};

globalThis.RenderRSC = async () => {
	return await renderToJSON(<Component />);
};