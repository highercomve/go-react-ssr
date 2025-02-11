import React, { useRef, useEffect } from "react";

// Define cell size and grid dimensions for a 6x6 square.
const CELL_SIZE = 20;
const COLS = 6;
const ROWS = 6;
const canvasWidth = CELL_SIZE * COLS;
const canvasHeight = CELL_SIZE * ROWS;

const Loading = () => {
	const canvasRef = useRef(null);

	// Compute the border positions in a clockwise order starting from the top-left corner.
	function computeBorderPoints() {
		const points = [];
		// Top row (left to right)
		for (let x = 0; x < COLS; x++) {
			points.push({ x, y: 0 });
		}
		// Right column (top to bottom; skip the top corner)
		for (let y = 1; y < ROWS; y++) {
			points.push({ x: COLS - 1, y });
		}
		// Bottom row (right to left; skip the bottom right corner)
		for (let x = COLS - 2; x >= 0; x--) {
			points.push({ x, y: ROWS - 1 });
		}
		// Left column (bottom to top; skip both bottom left and top left corners)
		for (let y = ROWS - 2; y >= 1; y--) {
			points.push({ x: 0, y });
		}
		return points;
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false; // Disable smoothing for a crisp, pixelated look.

		// Calculate border points.
		const borderPoints = computeBorderPoints();
		let currentIndex = 0;

		// Draw the grid and the moving dot.
		function draw() {
			// Clear the canvas by filling it with a black background.
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			// Draw grid lines across the 6x6 square.
			ctx.strokeStyle = "#444";
			for (let x = 0; x < COLS; x++) {
				for (let y = 0; y < ROWS; y++) {
					ctx.strokeRect(
						x * CELL_SIZE,
						y * CELL_SIZE,
						CELL_SIZE,
						CELL_SIZE,
					);
				}
			}

			// Draw the dot (a red square) at the current border position.
			ctx.fillStyle = "#FF0000";
			const point = borderPoints[currentIndex];
			ctx.fillRect(
				point.x * CELL_SIZE,
				point.y * CELL_SIZE,
				CELL_SIZE,
				CELL_SIZE,
			);
		}

		// Update the dot's position along the border.
		function update() {
			currentIndex = (currentIndex + 1) % borderPoints.length;
		}

		// Use a recurring interval to update and draw the new position every 500ms.
		const intervalId = setInterval(() => {
			update();
			draw();
		}, 100);

		// Draw initially.
		draw();

		// Cleanup interval on component unmount.
		return () => clearInterval(intervalId);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={canvasWidth}
			height={canvasHeight}
			style={{
				border: "2px solid #fff",
				display: "block",
				margin: "auto",
				background: "#000",
				imageRendering: "pixelated", // Keeps the pixel art look scaling.
			}}
		/>
	);
};

export default Loading;
