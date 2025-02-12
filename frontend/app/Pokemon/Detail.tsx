import { hydrateRoot } from "react-dom/client";
import { deserializeElement } from "../../lib/rsc.helpers";

declare global {
  interface Window {
    __INITIAL_CLIENT_JSX_STRING__: string;
  }
}

const container = document.getElementById("react-app");

if (!container) throw new Error("Could not find react-app element");

const clientJSX = deserializeElement(window.__INITIAL_CLIENT_JSX_STRING__);

hydrateRoot(container, clientJSX);

