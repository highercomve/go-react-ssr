import React, { useState, useEffect } from "react";

/**
 * WelcomeMessage component that displays and updates a message after initial render.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.initialMessage - The initial message to display.
 */
export function WelcomeMessage({ initialMessage = "" }) {
	const [currentMessage, setCurrentMessage] = useState(initialMessage);

	useEffect(() => {
		setTimeout(() => {
			setCurrentMessage("Message updated after first render");
		}, 1000);
	}, []);

	return <p className="welcome-message">{currentMessage}</p>;
}

WelcomeMessage.$$typeof = Symbol.for('react.client.component'); 