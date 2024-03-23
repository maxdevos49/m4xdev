import {canvasApp} from './canvas-app.js';

/**
 * @typedef {import('./canvas-app.js').CanvasAppSetup} CanvasAppSetup
 * @typedef {import('./canvas-app.js').CanvasAppUpdate} CanvasAppUpdate
 * @typedef {import('./canvas-app.js').CanvasAppRender} CanvasAppRender
 */

const width = 500;
const height = 500;
const gridWidth = 100;
const gridHeight = 100;
/** @type {Array<number>} */
const sand = new Array(gridWidth * gridHeight).fill(0, 0, gridWidth * gridHeight);
const grainSize = width / gridWidth;

/**
 * @satisfies {CanvasAppRender}
 */
const render = (ctx) => {
	// Clear the screen
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if (sand[gridWidth / 2] === 0) {
		if (Math.random() > 0.5) {
			sand[gridWidth / 2] = 1;
		}
	}

	const place2 = gridWidth / 4;
	if (sand[place2] === 0) {
		if (Math.random() > 0.8) {
			sand[place2] = 1;
		}
	}

	const place3 = gridWidth - 10;
	if (sand[place3] === 0) {
		if (Math.random() > 0.98) {
			sand[place3] = 1;
		}
	}

	// Draw the sand
	ctx.fillStyle = 'tan';
	for (let index = sand.length - 1; index >= 0; index--) {
		const grain = sand[index];
		if (grain === 0) {
			continue;
		}

		const belowIndex = index + gridWidth;
		if (belowIndex <= sand.length && sand[belowIndex] === 0) {
			sand[belowIndex] = sand[index];
			sand[index] = 0;
		} else {
			const leftIndex = index + gridWidth - 1;
			const rightIndex = index + gridWidth + 1;

			const canGoRight = rightIndex <= sand.length && sand[rightIndex] === 0;
			const canGoLeft = leftIndex <= sand.length && sand[leftIndex] === 0;

			const goLeft = () => {
				sand[leftIndex] = sand[index];
				sand[index] = 0;
			};

			const goRight = () => {
				sand[rightIndex] = sand[index];
				sand[index] = 0;
			};

			if (canGoLeft && canGoRight) {
				if (Math.random() > 0.5) {
					goLeft();
				} else {
					goRight();
				}
			} else if (canGoLeft) {
				goLeft();
			} else if (canGoRight) {
				goRight();
			}
		}


		const x = index % gridWidth * grainSize;
		const y = Math.floor(index / gridWidth) * grainSize;
		ctx.fillRect(x, y, grainSize, grainSize);
	}
};

const sandApp = canvasApp({
	frameRate: 30,
	width: width,
	height: height,
	render
});


document.addEventListener('DOMContentLoaded', () => {
	const controls = sandApp.mount('#app');
	controls.play();
});
