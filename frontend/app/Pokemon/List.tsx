import { hydrateRoot } from "react-dom/client";
import { deserializeElement } from "../../lib/rsc.helpers";
import { registerComponent } from "../../lib/rsc.helpers";
import { ServerSuspense } from "../../components/ServerSuspense";
import { Pokemons } from "../../components/Pokemon/App";
import Loading from "../../components/Loading";

declare global {
  interface Window {
    __INITIAL_CLIENT_JSX_STRING__: string;
  }
}

// Register client components		
registerComponent('ServerSuspense', ServerSuspense);
registerComponent('Pokemons', Pokemons);
registerComponent('Loading', Loading);

const container = document.getElementById("react-app");
if (!container) throw new Error("Could not find react-app element");
const clientJSX = deserializeElement(window.__INITIAL_CLIENT_JSX_STRING__);

hydrateRoot(container, clientJSX);

