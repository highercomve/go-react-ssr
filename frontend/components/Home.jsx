import React from "react";
import { Counter } from "./Counter.jsx";
import { WelcomeMessage } from "./WelcomeMessage.jsx";
import { ServerSuspense } from "./ServerSuspense.jsx";
import Loading from "./Loading.jsx";

/**
 * Home component displays a welcome message.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.message - The initial welcome message.
 * @param {number} [props.initialCount] - Optional callback function to be called after a delay.
 */
export function Home({ message = "", initialCount = 0 }) {
	return (
		<div className="welcome-container">
			<h1 className="welcome-title">Welcome to Our Website</h1>
			<WelcomeMessage initialMessage={message} />
			<Counter initialCount={initialCount} />
			<ServerSuspense fallback={<Loading />} componentPath="About.js" />
		</div>
	);
}
