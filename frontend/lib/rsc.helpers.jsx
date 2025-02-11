import React from "react";

// Store for registered components
const componentRegistry = new Map();
const componentCache = new Map();

export function getCachedComponent(key) {
	return componentCache.get(key);
}

export function setCachedComponent(key, component) {
	componentCache.set(key, component);
}

export function invalidateCache(key) {
	componentCache.delete(key);
}

// Client-side component registry
export function registerComponent(name, component) {
	componentRegistry.set(name, component);
}

// React symbols for component types
const REACT_ELEMENT_TYPE = Symbol.for("react.element");
const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
const REACT_PROVIDER_TYPE = Symbol.for("react.provider");
const REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
const REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
const REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
const REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
const REACT_MEMO_TYPE = Symbol.for("react.memo");
const REACT_LAZY_TYPE = Symbol.for("react.lazy");
const REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for(
	"react.default_value",
);

// Enhanced serializeElement function
export function serializeElement(element) {
	// Handle non-React elements
	if (!React.isValidElement(element)) {
		if (element === null || element === undefined) {
			return element;
		}
		return typeof element === "string" ? element : String(element);
	}

	let { type, props, key } = element;

	if (!key) {
		key = Math.random().toString(36).substring(2, 15);
	}

	// Add specific check for Suspense component
	if (type === React.Suspense) {
		return {
			$$typeof: "$RS",
			type: {
				$$typeof: "$RS",
				value: "Suspense",
			},
			props: serializeProps(type.$$typeof, props),
			key: key,
		};
	}

	// For function components, we need to render them to get their children
	if (
		typeof type === "function" &&
		type.$$typeof !== Symbol.for("react.client.component")
	) {
		try {
			const renderedElement = type(props);
			const serialized = serializeElement(renderedElement);
			if (key != null) {
				serialized.key = key;
			}
			return serialized;
		} catch (error) {
			// console.error(`Error rendering component ${type.name}:`, error);
			return {
				$$typeof:
					type.$$typeof === Symbol.for("react.server.component")
						? "$RSC"
						: "$RC",
				type: {
					$$typeof:
						type.$$typeof === Symbol.for("react.server.component")
							? "$RSC"
							: "$RC",
					value: type.name || "Anonymous",
				},
				props: serializeProps(type.$$typeof, props),
				key: key,
			};
		}
	}

	// For React elements that are server components
	if (type.$$typeof === Symbol.for("react.server.component")) {
		const serializedProps = serializeProps(type.$$typeof, props);
		return {
			$$typeof: "$RSC",
			type: {
				$$typeof: "$RSC",
				value: type.name || "Anonymous",
			},
			props: serializedProps,
			key: key,
		};
	}

	// Rest of the existing serializeElement logic...
	let serializedType;
	if (typeof type === "string") {
		serializedType = type;
	} else {
		// Handle React special types
		const typeSymbol = type.$$typeof;
		switch (typeSymbol) {
			case REACT_ELEMENT_TYPE:
				serializedType = {
					$$typeof: "$RE",
					value: type.name || "Element",
				};
				break;
			case REACT_FRAGMENT_TYPE:
				serializedType = {
					$$typeof: "$RF",
					value: "Fragment",
				};
				break;
			case REACT_SUSPENSE_TYPE:
				serializedType = {
					$$typeof: "$RS",
					value: "Suspense",
				};
				break;
			case REACT_SUSPENSE_LIST_TYPE:
				serializedType = {
					$$typeof: "$RSL",
					value: "SuspenseList",
				};
				break;
			case REACT_PROVIDER_TYPE:
				serializedType = {
					$$typeof: "$RP",
					value: type._context.displayName || "Provider",
				};
				break;
			case REACT_SERVER_CONTEXT_TYPE:
				serializedType = {
					$$typeof: "$RSC",
					value: type.displayName || "ServerContext",
				};
				break;
			case REACT_FORWARD_REF_TYPE:
				serializedType = {
					$$typeof: "$RFR",
					value: type.render.name || "ForwardRef",
				};
				break;
			case REACT_MEMO_TYPE:
				serializedType = {
					$$typeof: "$RM",
					value: type.type.name || "Memo",
				};
				break;
			case REACT_LAZY_TYPE:
				serializedType = {
					$$typeof: "$LAZY",
					value: type._payload?.value?.name || "Anonymous",
				};
				break;
			default:
				// Client or Server Component
				serializedType = {
					$$typeof:
						type.$$typeof === Symbol.for("react.server.component")
							? "$RSC"
							: "$RC",
					value: type.name || "Anonymous",
				};
		}
	}

	// Process props including children
	const serializedProps = serializeProps(type.$$typeof, props);

	// For regular DOM elements and other React elements, include children in the result
	return {
		$$typeof: serializedType.$$typeof,
		type: serializedType,
		props: serializedProps,
		key: key,
	};
}

// Helper function to serialize props
function serializeProps(type, props) {
	if (!props) return props;

	return Object.fromEntries(
		Object.entries(props).map(([key, value]) => {
			// Handle children prop specially
			if (key === "children") {
				// If children is an array
				if (Array.isArray(value)) {
					return [key, value.map((child) => serializeElement(child))];
				}
				// If children is a single element
				return [key, serializeElement(value)];
			}

			// Handle arrays
			if (Array.isArray(value)) {
				return [
					key,
					value.map((item) =>
						React.isValidElement(item)
							? serializeElement(item)
							: item,
					),
				];
			}

			// Handle React elements
			if (React.isValidElement(value)) {
				return [key, serializeElement(value)];
			}

			// Handle functions
			if (typeof value === "function") {
				return [
					key,
					{
						$$typeof: "$FN",
						name: value.name || "anonymous",
					},
				];
			}

			// Handle objects (but not dates or other special objects)
			if (
				value &&
				typeof value === "object" &&
				!Array.isArray(value) &&
				!(value instanceof Date)
			) {
				return [key, serializeProps(value)];
			}

			return [key, value];
		}),
	);
}

// Enhanced deserializeElement function
export function deserializeElement(json) {
	let data;
	try {
		data = typeof json === "string" ? JSON.parse(json) : json;
	} catch (e) {
		data = json;
	}

	if (!data || typeof data !== "object") {
		return data;
	}

	// Handle arrays
	if (Array.isArray(data)) {
		return data.map((item) => deserializeElement(item));
	}

	// For regular DOM elements without $$typeof
	if (!data.$$typeof && data.type && typeof data.type === "string") {
		const { type, props, key } = data;
		const deserializedProps = deserializeProps(props);
		return React.createElement(type, { ...deserializedProps, key });
	}

	// Check if this is a serialized React element
	if (data.$$typeof) {
		const { type, props, key } = data;

		// If it's a server component, directly render its children
		if (data.$$typeof === "$RSC") {
			return props.children ? deserializeElement(props.children) : null;
		}

		// Handle other React special types
		let resolvedType;
		switch (data.$$typeof) {
			case "$RF":
				resolvedType = React.Fragment;
				break;
			case "$RS":
				resolvedType = React.Suspense;
				break;
			case "$RSL":
				resolvedType = React.SuspenseList;
				break;
			case "$RP":
				const context = getComponent(type.value);
				resolvedType = context?.Provider;
				break;
			case "$RFR":
				resolvedType = React.forwardRef(() => {
					const Component = getComponent(type.value);
					return Component ? <Component {...props} /> : null;
				});
				break;
			case "$RM":
				const MemoComponent = getComponent(type.value);
				resolvedType = React.memo(MemoComponent);
				break;
			case "$LAZY":
				resolvedType = React.lazy(() => {
					const component = getComponent(type.value);
					return Promise.resolve({ default: component });
				});
				break;
			case "$RCC":
				resolvedType = getComponent(type.value);
				break;
			case "$RC":
				resolvedType = getComponent(type.value);
				break;
			default:
				resolvedType = type;
		}

		const deserializedProps = deserializeProps(props);

		return React.createElement(resolvedType || type, {
			...deserializedProps,
			key,
		});
	}

	// If it's just a plain object with type and props (DOM element)
	if (data.type && data.props) {
		const { type, props, key } = data;
		const deserializedProps = deserializeProps(props);
		return React.createElement(type, { ...deserializedProps, key });
	}

	return data;
}

// Helper function to deserialize props
function deserializeProps(props) {
	if (!props) return props;

	const result = {};
	for (const [key, value] of Object.entries(props)) {
		if (value && typeof value === "object" && value.$$typeof === "$FN") {
			// Convert serialized functions to empty void function
			result[key] = () => {};
		} else if (key === "children") {
			// Handle children specifically
			if (Array.isArray(value)) {
				result[key] = value.map((child) => deserializeElement(child));
			} else {
				result[key] = deserializeElement(value);
			}
		} else if (Array.isArray(value)) {
			// Handle arrays
			result[key] = value.map((item) =>
				item && typeof item === "object"
					? deserializeElement(item)
					: item,
			);
		} else if (value && typeof value === "object") {
			// Handle nested objects
			result[key] = deserializeElement(value);
		} else {
			// Handle primitive values
			result[key] = value;
		}
	}
	return result;
}

// JSON stringify helper
export function stringifyJSX(key, value) {
	if (value === Symbol.for("react.element")) return "$RE";
	if (value === Symbol.for("react.server.component")) return "$RSC";
	if (value === Symbol.for("react.client.component")) return "$RCC";
	if (value === Symbol.for("react.component")) return "$RC";
	if (value === Symbol.for("react.transitional.element")) return "$RTE";
	if (value === Symbol.for("react.lazy")) return "$LAZY";
	if (value === Symbol.for("react.fragment")) return "$RF";
	if (value === Symbol.for("react.provider")) return "$RP";
	if (value === Symbol.for("react.server_context")) return "$RSC";
	if (value === Symbol.for("react.forward_ref")) return "$RFR";
	if (value === Symbol.for("react.suspense")) return "$RS";
	if (value === Symbol.for("react.suspense_list")) return "$RSL";
	if (value === Symbol.for("react.memo")) return "$RM";
	if (value === Symbol.for("react.default_value")) return "$RDV";
	return value;
}

export function parseJSX(key, value) {
	if (value === "$RE") return Symbol.for("react.element");
	if (value === "$RSC") return Symbol.for("react.server.component");
	if (value === "$RCC") return Symbol.for("react.client.component");
	if (value === "$RC") return Symbol.for("react.component");
	if (value === "$RTE") return Symbol.for("react.transitional.element");
	if (value === "$LAZY") return Symbol.for("react.lazy");
	if (value === "$RF") return Symbol.for("react.fragment");
	if (value === "$RP") return Symbol.for("react.provider");
	if (value === "$RSC") return Symbol.for("react.server_context");
	if (value === "$RFR") return Symbol.for("react.forward_ref");
	if (value === "$RS") return Symbol.for("react.suspense");
	if (value === "$RSL") return Symbol.for("react.suspense_list");
	if (value === "$RM") return Symbol.for("react.memo");
	if (value === "$RDV") return Symbol.for("react.default_value");
	return value;
}

// Server-side render helper
export function renderToJSON(element) {
	return JSON.stringify(serializeElement(element), stringifyJSX);
}

// Helper to check if a component is a valid React component
function isReactComponent(component) {
	return (
		component &&
		(typeof component === "function" ||
			(typeof component === "object" &&
				(component.$$typeof === Symbol.for("react.forward_ref") ||
					component.$$typeof === Symbol.for("react.memo"))))
	);
}

export function registerComponentTree(RootComponent) {
	const registered = new Set(); // Keep track of registered components to avoid duplicates

	function analyzeAndRegister(Component) {
		// Skip if already registered or not a valid component
		if (!Component || registered.has(Component)) return;

		const name = Component.displayName || Component.name;
		if (!name) {
			console.warn("Found component without name:", Component);
			return;
		}

		// Register the component
		componentRegistry.set(name, Component);
		registered.add(Component);

		// Get component's properties and methods
		const prototype = Component.prototype;
		const properties = Object.getOwnPropertyNames(Component);

		// Look for nested components in static properties
		properties.forEach((prop) => {
			const value = Component[prop];
			if (isReactComponent(value)) {
				analyzeAndRegister(value);
			}
		});

		// Look for nested components in render method
		if (prototype?.render) {
			// We can't actually analyze the JSX in the render method at runtime
			// But we can look for component references in the prototype
			Object.getOwnPropertyNames(prototype).forEach((prop) => {
				const value = prototype[prop];
				if (isReactComponent(value)) {
					analyzeAndRegister(value);
				}
			});
		}

		// If it's a functional component, we can try to find references in its body
		if (typeof Component === "function" && Component.toString) {
			const fnBody = Component.toString();
			// This is a simple regex to find potential component references
			// Note: This is not foolproof and might miss some components
			const componentMatches = fnBody.match(/[A-Z][a-zA-Z0-9]+/g) || [];
			componentMatches.forEach((match) => {
				if (global[match] && isReactComponent(global[match])) {
					analyzeAndRegister(global[match]);
				}
			});
		}
	}

	// Start the registration process with the root component
	analyzeAndRegister(RootComponent);

	// Return the registry for use in the application
	return componentRegistry;
}

// Helper function to get a registered component
export function getComponent(name) {
	return componentRegistry.get(name);
}

// Helper function to check if a component is registered
export function isRegistered(name) {
	return componentRegistry.has(name);
}
