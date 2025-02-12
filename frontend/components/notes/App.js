/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import { Suspense } from "react";

import Note from "./Note";
import NoteList from "./NoteList";
import EditButton from "./EditButton";
import SearchField from "./SearchField";
import NoteSkeleton from "./NoteSkeleton";
import NoteListSkeleton from "./NoteListSkeleton";
import { RouterProvider } from "./framework/router";

App.$$typeof = Symbol.for("react.server.component");

export default function App({
	selectedId = null,
	isEditing = false,
	searchText = "",
	notes = [],
}) {
	if (notes == null) {
		notes = [];
	}
	return (
		<RouterProvider initialLocation={{ selectedId, isEditing, searchText }}>
			<div className="main">
				<section className="col sidebar">
					<section className="sidebar-menu" role="menubar">
						<SearchField />
						<EditButton noteId={null}>New</EditButton>
					</section>
					<nav>
						<Suspense fallback={<NoteListSkeleton />}>
							<NoteList searchText={searchText} notes={notes} />
						</Suspense>
					</nav>
				</section>
				<section key={selectedId} className="col note-viewer">
					<Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
						<Note selectedId={selectedId} isEditing={isEditing} />
					</Suspense>
				</section>
			</div>
		</RouterProvider>
	);
}
