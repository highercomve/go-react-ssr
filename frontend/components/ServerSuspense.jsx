import React, { useEffect, useState } from "react";
import { deserializeElement } from "../lib/rsc.helpers";

ServerSuspense.$$typeof = Symbol.for("react.client.component");

export function ServerSuspense({
	fallback,
	errorFallback,
	componentPath,
	...props
}) {
	const [component, setComponent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchComponent() {
			try {
				setLoading(true);
				setError(null);

				const filteredProps = Object.fromEntries(
					Object.entries(props).filter(
						([_, value]) => typeof value !== "function",
					),
				);
				const queryParams = new URLSearchParams({
					...filteredProps,
					component: componentPath,
				});

				const response = await fetchWithTimeout(
					`/rsc?${queryParams}`,
					null,
					2000,
				);
				if (!response.ok) {
					throw new Error(
						`Failed to fetch component: ${response.statusText}`,
					);
				}

				const jsonData = await response.json();

				const element = deserializeElement(jsonData);

				setComponent(element);
			} catch (error) {
				console.error("Error fetching component:", error);
				setError(error);
			} finally {
				setLoading(false);
			}
		}

		fetchComponent();
	}, [componentPath, ...Object.values(props)]);

	if (loading) {
		return fallback;
	}

	if (error) {
		return (
			errorFallback || <div>Error loading component: {error.message}</div>
		);
	}

	return React.cloneElement(component, props);
}

function fetchWithTimeout(url, body, time = 0) {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(url, body);
			setTimeout(() => {
				resolve(response);
			}, time);
		} catch (e) {
			reject(e);
		}
	});
}
