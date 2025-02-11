import React, { useCallback, useState } from "react";

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