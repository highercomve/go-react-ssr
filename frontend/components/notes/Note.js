/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use server";

import React from "react";
import { format } from "date-fns";

import NotePreview from "./NotePreview";
import EditButton from "./EditButton";
import NoteEditor from "./NoteEditor";

// This is a server component by default
Note.$$typeof = Symbol.for("react.server.component");
Note.path = "notes/Note";

export default async function Note({ selectedId, isEditing }) {
	if (!selectedId) {
		if (isEditing) {
			return (
				<NoteEditor
					noteId={null}
					initialTitle="Untitled"
					initialBody=""
				/>
			);
		} else {
			return (
				<div className="note--empty-state">
					<span className="note-text--empty-state">
						Click a note on the left to view something! 🥺
					</span>
				</div>
			);
		}
	}

	const noteResponse = await fetch(`api/v1/notes/${selectedId}`);
	const note = await noteResponse.json();

	let { id, title, body, updated_at } = note;
	const updatedAt = new Date(updated_at);

	if (isEditing) {
		return (
			<NoteEditor noteId={id} initialTitle={title} initialBody={body} />
		);
	} else {
		return (
			<div className="note">
				<div className="note-header">
					<h1 className="note-title">{title}</h1>
					<div className="note-menu" role="menubar">
						<small className="note-updated-at" role="status">
							Last updated on{" "}
							{format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
						</small>
						<EditButton noteId={id}>Edit</EditButton>
					</div>
				</div>
				<NotePreview body={body} />
			</div>
		);
	}
}
