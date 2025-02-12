import React from "react";

import { useState, useCallback, useContext, createContext } from "react";
import {
	deserializeElement,
	registerComponent,
} from "../../../lib/rsc.helpers";
import NoteEditor from "../NoteEditor";
import SearchField from "../SearchField";
import SidebarNoteContent from "../SidebarNoteContent";
import Spinner from "../Spinner";

// Register necessary client components
registerComponent("NoteEditor", NoteEditor);
registerComponent("SearchField", SearchField);
registerComponent("SidebarNoteContent", SidebarNoteContent);
registerComponent("Spinner", Spinner);

// Create router context
const RouterContext = createContext(null);

// Default location state
const defaultLocation = {
	selectedId: null,
	isEditing: false,
	searchText: "",
};

export function RouterProvider({
	children,
	initialLocation = defaultLocation,
}) {
	const [location, setLocation] = useState(initialLocation);

	const navigate = useCallback(
		async (nextLocation) => {
			// Merge with existing location to allow partial updates
			const newLocation = { ...location, ...nextLocation };
			setLocation(newLocation);

			// If we're navigating to a note, fetch its server component
			if (newLocation.selectedId !== null) {
				try {
					const queryParams = new URLSearchParams({
						component: "Note",
						selectedId: newLocation.selectedId,
						isEditing: newLocation.isEditing,
					});

					const response = await fetch(`/rsc?${queryParams}`);
					if (!response.ok) {
						throw new Error(
							`Failed to fetch note: ${response.statusText}`,
						);
					}

					const jsonData = await response.json();
					const element = deserializeElement(jsonData);

					// Handle the fetched server component
					// You might want to store this in state or handle it differently
					return element;
				} catch (error) {
					console.error("Error fetching note:", error);
				}
			}
		},
		[location],
	);

	return (
		<RouterContext.Provider value={{ location, navigate }}>
			{children}
		</RouterContext.Provider>
	);
}

export function useRouter() {
	const router = useContext(RouterContext);
	if (router === null) {
		throw new Error("useRouter must be used within a RouterProvider");
	}
	return router;
}

// Custom hook for mutations (create, update, delete)
export function useMutation({ endpoint, method }) {
	const { navigate } = useRouter();
	const [isPending, setPending] = useState(false);

	const mutate = useCallback(
		async (payload, nextLocation) => {
			setPending(true);
			try {
				const response = await fetch(endpoint, {
					method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					throw new Error(`Mutation failed: ${response.statusText}`);
				}

				// Navigate to next location after successful mutation
				if (nextLocation) {
					await navigate(nextLocation);
				}

				return await response.json();
			} catch (error) {
				console.error("Mutation error:", error);
				throw error;
			} finally {
				setPending(false);
			}
		},
		[endpoint, method, navigate],
	);

	return [isPending, mutate];
}
