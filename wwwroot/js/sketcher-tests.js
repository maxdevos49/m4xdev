import {FilterImageData} from "./canvas/filter.js";
import {ImageSketcher} from "./canvas/image-sketcher.js";
import {Sketcher} from "./canvas/sketcher.js";
import {LoadImage} from "./content/image.js";

async function main() {
	/** @type {HTMLCanvasElement|null} */
	const canvas = document.querySelector("canvas#sketcher-test");
	if (canvas === null) {
		throw new Error("Canvas element is missing.");
	}

	const ctx = canvas.getContext("2d", {willReadFrequently: true});
	if (ctx === null) {
		throw new Error("Failed to get canvas context.");
	}

	const pen = Sketcher(ctx);

	pen.down(10, 10);
	pen.move(100, 10);
	pen.move(100, 100);
	pen.move(10, 100);
	pen.move(10, 10);
	pen.up();

	const cubeImage = await LoadImage("/img/cube.jpeg");
	ctx.drawImage(cubeImage, 0, 0, 250, 250);

	let imageData = ctx.getImageData(0, 0, 250, 250, {colorSpace: "srgb"});
	ctx.putImageData(await FilterImageData("grayscale", imageData), 250, 0);

	imageData = ctx.getImageData(250, 0, 250, 250, {colorSpace: "srgb"});
	ctx.putImageData(await FilterImageData("sobel", imageData), 0, 250);

	imageData = ctx.getImageData(0, 251, 250, 250, {colorSpace: "srgb"});

	const lines = ImageSketcher(imageData);

	shuffleArray(lines);

	console.log("Total Lines", lines.length);
	console.log("Total Points", lines.flat().length);

	/**
	 * Converts index position to a x/y position.
	 *
	 * @param {ImageData} imageData
	 * @param {number} index
	 * @returns {[x: number, y: number]}
	 */
	const toXY = (imageData, index) => {
		return [
			(index / 4) % imageData.height + 1,
			(index / 4) / imageData.width + 1
		];
	};

	const offset = 251;

	for (const line of lines) {
		const [sx, sy] = toXY(imageData, line[0]);

		pen.down(offset + sx, offset + sy);
		for (const point of line) {
			const [x, y] = toXY(imageData, point);

			pen.move(offset + x, offset + y);

			await new Promise((resolve) => {
				setTimeout(resolve, 0);
			});
		}

		pen.up();
	}
}
main();

/**
 *Randomly shuffle an array.
 *
 * @template T
 * @param {Array<T>} array
 */
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
