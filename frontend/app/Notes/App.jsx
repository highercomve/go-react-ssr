import { hydrateRoot } from "react-dom/client";
import { deserializeElement, registerComponent } from "../../lib/rsc.helpers";

import App from "../../components/notes/App";
import NoteEditor from "../../components/notes/NoteEditor";
import SearchField from "../../components/notes/SearchField";
import SidebarNoteContent from "../../components/notes/SidebarNoteContent";
import EditButton from "../../components/notes/EditButton";
import { RouterProvider } from "../../components/notes/framework/router";

registerComponent("App", App);
registerComponent("NoteEditor", NoteEditor);
registerComponent("SearchField", SearchField);
registerComponent("SidebarNoteContent", SidebarNoteContent);
registerComponent("EditButton", EditButton);
registerComponent("RouterProvider", RouterProvider);

const container = document.getElementById("react-app");
const clientJSX = deserializeElement(window.__INITIAL_CLIENT_JSX_STRING__);

console.log(window.__INITIAL_CLIENT_JSX_STRING__);
console.log("clientJSX", clientJSX);

hydrateRoot(container, clientJSX);
