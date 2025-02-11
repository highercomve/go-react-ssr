import { hydrateRoot } from "react-dom/client";
import { deserializeElement, registerComponent } from "../lib/rsc.helpers.jsx";
import { Counter } from "../components/Counter";
import { WelcomeMessage } from "../components/WelcomeMessage";
import { About } from "../components/About";
import { ServerSuspense } from "../components/ServerSuspense";
import Loading from "../components/Loading";

// Register client components
registerComponent("Counter", Counter);
registerComponent("WelcomeMessage", WelcomeMessage);
registerComponent("About", About);
registerComponent("ServerSuspense", ServerSuspense);
registerComponent("Loading", Loading);

const container = document.getElementById("react-app");
const clientJSX = deserializeElement(window.__INITIAL_CLIENT_JSX_STRING__);

hydrateRoot(container, clientJSX);
