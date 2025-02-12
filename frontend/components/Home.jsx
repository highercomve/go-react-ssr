import React from "react";
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
			<ServerSuspense fallback={<Loading />} componentPath="About" />
		</div>
	);
}

/**
 * Counter component that manages a count value with increment and decrement functionality.
 * 
 * @param {Object} props - The properties object.
 * @param {number} [props.initialCount] - The initial count value.
 */
export function Counter({ initialCount = 0 }) {
	const [count, setCount] = useState(initialCount);

	const increment = useCallback(() => setCount(count + 1), [count]);
	const decrement = useCallback(() => setCount(count - 1), [count]);

	return (
		<div className="counter">
			<button onClick={decrement}>-</button>
			<span>{count}</span>
			<button onClick={increment}>+</button>
		</div>
	);
}

Counter.$$typeof = Symbol.for('react.client.component'); 

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