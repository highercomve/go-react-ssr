import { hydrateRoot } from "react-dom/client";
import { deserializeElement, registerComponent } from "../lib/rsc.helpers";
import { ServerSuspense } from "../components/ServerSuspense";
import Loading from "../components/Loading";
import { Counter, WelcomeMessage } from "../components/Home";
import { About } from "../components/About";

// Register client components
registerComponent("Counter", Counter);
registerComponent("WelcomeMessage", WelcomeMessage);
registerComponent("About", About);
registerComponent("ServerSuspense", ServerSuspense);
registerComponent("Loading", Loading);

const container = document.getElementById("react-app");
const clientJSX = deserializeElement(window.__INITIAL_CLIENT_JSX_STRING__);

hydrateRoot(container, clientJSX);
