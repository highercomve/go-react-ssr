import React, { useCallback, useEffect, useState } from "react";

/**
 * Home component displays a welcome message.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.message - The initial welcome message.
 * @param {number} [props.initialCount] - Optional callback function to be called after a delay.
 */
export function Home({ message = "", initialCount = 0 }) {
	const [count, setCount] = useState(initialCount);
	const [currentMessage, setCurrentMessage] = useState(message);

	const increment = useCallback(() => setCount(count + 1), [count]);
	const decrement = useCallback(() => setCount(count - 1), [count]);

	useEffect(() => {
		setTimeout(() => {
			setCurrentMessage("Message updated after first render");
		}, 1000);
	}, []);

	return (
		<div className="welcome-container">
			<h1 className="welcome-title">Welcome to Our Website</h1>
			<p className="welcome-message">{currentMessage}</p>
			<div className="counter">
				<button onClick={decrement}>-</button>
				<span>{count}</span>
				<button onClick={increment}>+</button>
			</div>
		</div>
	);
}
