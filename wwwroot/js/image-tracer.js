import {FilterImageData} from "./canvas/filter.js";
import {TraceImage, indexToXY} from "./canvas/image-sketcher.js";
import {Sketcher} from "./canvas/sketcher.js";
import {LoadImage, LoadImageFromBlob} from "./content/image.js";

/**
 * Sketches an array of lines.
 *
 * @param {ReturnType<Sketcher>} pen
 * @param {number} xOffset
 * @param {number} yOffset
 * @param {number} width
 * @param {number} height
 * @param {Array<Array<number>>} lines
 */
function* sketchImage(pen, xOffset, yOffset, width, height, lines) {
	const totalPoints = lines.flat().length;
	let currentPoint = 0;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const [sx, sy] = indexToXY(width, height, line[0]);

		pen.down(xOffset + sx, yOffset + sy);

		for (const point of line) {
			const [x, y] = indexToXY(width, height, point);

			pen.move(xOffset + x, yOffset + y);

			// Report progress
			currentPoint++;
			yield (100 * currentPoint) / totalPoints;
		}

		pen.up();
	}
}

/**
 *
 * @param {HTMLImageElement} image
 * @param {any} state
 */
async function startSketch(image, state) {
	const {
		ctx,
		width,
		height,
		totalLinesDD,
		totalPointsDD,
		progressDD,
		dataTextArea,
	} = state;

	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(image, 0, 0, width / 2, height / 2);

	const originalImageData = ctx.getImageData(0, 0, width / 2, height / 2, {colorSpace: "srgb"});
	ctx.putImageData(await FilterImageData("grayscale", originalImageData), width / 2, 0);

	const grayscaleImageData = ctx.getImageData(width / 2, 0, width / 2, height / 2, {colorSpace: "srgb"});
	ctx.putImageData(await FilterImageData("sobel", grayscaleImageData), 0, height / 2);

	const sobelImageData = ctx.getImageData(0, height / 2, width / 2, height / 2, {colorSpace: "srgb"});

	const lines = TraceImage(sobelImageData);

	totalLinesDD.innerText = String(lines.length);
	totalPointsDD.innerText = String(lines.flat().length);
	dataTextArea.innerText = JSON.stringify({width: originalImageData.width, height: originalImageData.height, lines: lines});

	const pen = Sketcher(ctx);
	const drawer = sketchImage(pen, width / 2, height / 2, originalImageData.width, originalImageData.height, lines);

	for (const progress of drawer) {

		if (state.reset) {
			state.reset = false;
			break;
		}

		progressDD.textContent = progress.toFixed(1) + "%";

		await new Promise((resolve) => {
			setTimeout(resolve, 5);
		});
	}

	progressDD.textContent = "100.0%";
}

async function main() {
	/** @type {HTMLInputElement|null} */
	const imageFileInput = document.querySelector("#sketcher-image");
	if (!imageFileInput) {
		throw new Error("File input element is missing");
	}

	/** @type {HTMLFormElement|null} */
	const imageForm = document.querySelector("#sketcher-form");
	if (!imageForm) {
		throw new Error("Form element is missing");
	}

	/** @type {HTMLElement|null} */
	const totalLinesDD = document.querySelector("#sketcher-lines");
	if (!totalLinesDD) {
		throw new Error("dd element is missing");
	}

	/** @type {HTMLElement|null} */
	const totalPointsDD = document.querySelector("#sketcher-points");
	if (!totalPointsDD) {
		throw new Error("dd element is missing");
	}

	/** @type {HTMLElement|null} */
	const progressDD = document.querySelector("#sketcher-progress");
	if (!progressDD) {
		throw new Error("dd element is missing");
	}

	/** @type {HTMLTextAreaElement|null} */
	const dataTextArea = document.querySelector("#sketcher-data");
	if (!dataTextArea) {
		throw new Error("textarea element is missing");
	}

	/** @type {HTMLCanvasElement|null} */
	const canvas = document.querySelector("#sketcher-canvas");
	if (canvas === null) {
		throw new Error("Canvas element is missing.");
	}

	const ctx = canvas.getContext("2d", {willReadFrequently: true});
	if (ctx === null) {
		throw new Error("Failed to get canvas context.");
	}


	const state = {
		reset: false,
		width: canvas.width,
		height: canvas.height,
		ctx,
		totalLinesDD,
		totalPointsDD,
		progressDD,
		dataTextArea
	};


	imageForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		state.reset = true;

		const formData = new FormData(imageForm);

		const file = formData.get("sketcher-image");
		if (!(file instanceof Blob)) {
			throw new Error("Unexpected instance type.");
		}

		const customImage = await LoadImageFromBlob(file);

		const nextSketch = () => {
			if (state.reset) {
				setTimeout(nextSketch, 100);
			}

			startSketch(customImage, state);
		};

		setTimeout(nextSketch, 100);
	});

	const defaultImage = await LoadImage("/img/cube.jpeg");
	startSketch(defaultImage, state);
}
main();
