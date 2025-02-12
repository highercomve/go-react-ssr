import React from "react";
import SidebarNote from "./SidebarNote";

NoteList.$$typeof = Symbol.for("react.server.component");

export default function NoteList({ notes = [], searchText }) {
	return notes.length > 0 ? (
		<ul className="notes-list">
			{notes.map((note) => (
				<li key={note.id}>
					<SidebarNote note={note} />
				</li>
			))}
		</ul>
	) : (
		<div className="notes-empty">
			{searchText
				? `Couldn't find any notes titled "${searchText}".`
				: "No notes created yet!"}{" "}
		</div>
	);
}
