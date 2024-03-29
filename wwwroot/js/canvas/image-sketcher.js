/**
 * Provides generators for sketching the hard edges in an image.(Incomplete)
 *
 * @param {ImageData} imageData
 */
export function ImageSketcher(imageData) {
	/** @type {Array<Array<number>>} */
	const lines = [];
	const data = imageData.data;

	let previousScanPixel = data[0];
	for (let i = 0; i < data.length; i += 4) {
		const currentScanPixel = data[i];

		if (previousScanPixel === 0 && currentScanPixel === 255 || previousScanPixel === 255 && currentScanPixel === 0) {
			/** @type {number|null} */
			let currentEdgePixel = currentScanPixel === 255 ? i - 4 : i;
			const line = [currentEdgePixel];

			do {
				const offsets = searchIndexes(imageData, currentEdgePixel);
				const normal = normalDirection(imageData, offsets);

				if (normal === null) {
					break;
				}

				currentEdgePixel = nextEdgePoint(imageData, offsets, normal);
				if (currentEdgePixel === null || currentEdgePixel < 0) {
					break;
				}

				const previousEdgePixel = line[line.length - 1];
				const secondPreviousEdgePixel = line[line.length - 2];
				const [cX, cY] = indexToXY(imageData.width, imageData.height, currentEdgePixel);
				const [pX, pY] = indexToXY(imageData.width, imageData.height, previousEdgePixel);

				if (line.length > 2) {
					const [spX, spY] = indexToXY(imageData.width, imageData.height, secondPreviousEdgePixel);

					const currentSlope = (cY - pY) / (cX - pX);
					const previousSlope = (pY - spY) / (pX - spX);

					if (cY === pY && pY === spY) { // Remove redundant horizontal points
						line[line.length - 1] = currentEdgePixel;
					} else if (cX === pX && pX === spX) { // Remove redundant vertical points
						line[line.length - 1] = currentEdgePixel;
					} else if (currentSlope - previousSlope === 0) { // Remove redundant diagonal points
						line[line.length - 1] = currentEdgePixel;
					} else {
						line.push(currentEdgePixel);
					}
				} else {
					line.push(currentEdgePixel);
				}
			} while (currentEdgePixel !== null && currentEdgePixel !== line[0]);

			if (line.length > 1) {
				lines.push(line);
			}
		}

		previousScanPixel = currentScanPixel;
	}

	return lines.sort((a, b) => b.length - a.length);
}

const NormalDirection = {
	top: 0,
	topRight: 1,
	right: 2,
	bottomRight: 3,
	bottom: 4,
	bottomLeft: 5,
	left: 6,
	topLeft: 7,
};

/**
 * Gets the direction the normal vector direction
 *
 * @param {ImageData} imageData The image data.
 * @param {ReturnType<searchIndexes>} offsets The positions around the point.
 *
 * @returns {number|null} The direction the normal vector points.
 */
function normalDirection(imageData, offsets) {
	const top = (imageData.data[offsets.top] ?? 0) === 255;
	const topRight = (imageData.data[offsets.topRight] ?? 0) === 255;
	const right = (imageData.data[offsets.right] ?? 0) === 255;
	const bottomRight = (imageData.data[offsets.bottomRight] ?? 0) === 255;
	const bottom = (imageData.data[offsets.bottom] ?? 0) === 255;
	const bottomLeft = (imageData.data[offsets.bottomLeft] ?? 0) === 255;
	const left = (imageData.data[offsets.left] ?? 0) === 255;
	const topLeft = (imageData.data[offsets.topLeft] ?? 0) === 255;

	if (
		(!top && !right && bottom && !left) // flat
		|| (!top && right && bottom && left) // cup
	) {
		return NormalDirection.top;
	}

	if (!top && !topRight && !right && bottom && left) {
		return NormalDirection.topRight;
	}

	if (
		(!top && !right && !bottom && left) // flat
		|| (top && !right && bottom && left) // cup
	) {
		return NormalDirection.right;
	}

	if (top && !right && !bottomRight && !bottom && left) {
		return NormalDirection.bottomRight;
	}

	if (
		(top && !right && !bottom && !left) // flat
		|| (top && right && !bottom && left) //cup
	) {
		return NormalDirection.bottom;
	}

	if (top && right && !bottom && !bottomLeft && !left) {
		return NormalDirection.bottomLeft;
	}

	if (
		(!top && right && !bottom && !left) //flat
		|| (top && right && bottom && !left) //cup
	) {
		return NormalDirection.left;
	}

	if (!top && right && bottom && !left && !topLeft) {
		return NormalDirection.topLeft;
	}

	return null;
}


/**
 * Follows a hard edge on a image.
 *
 * @param {ImageData} imageData The image data.
 * @param {ReturnType<searchIndexes>} offsets The position to follow from. This should already be on a edge.
 * @param {number} normal The normal pixel to start the search at.
 *
 * @returns {number|null} Yhe next edge position.
 */
function nextEdgePoint(imageData, offsets, normal) {
	const search = [
		{value: imageData.data[offsets.top] ?? 0, index: offsets.top},
		{value: imageData.data[offsets.topRight] ?? 0, index: offsets.topRight},
		{value: imageData.data[offsets.right] ?? 0, index: offsets.right},
		{value: imageData.data[offsets.bottomRight] ?? 0, index: offsets.bottomRight},
		{value: imageData.data[offsets.bottom] ?? 0, index: offsets.bottom},
		{value: imageData.data[offsets.bottomLeft] ?? 0, index: offsets.bottomLeft},
		{value: imageData.data[offsets.left] ?? 0, index: offsets.left},
		{value: imageData.data[offsets.topLeft] ?? 0, index: offsets.topLeft},
	];

	// cycle search array to the desired starting point based on the normal.
	for (let i = 0; i <= normal; i++) {
		const el = search.shift();
		if (!el) {
			throw new Error("Invalid search cycle amount");
		}
		search.push(el);
	}

	/**@type {{value: number, index: number}|null} */
	let previousPixel = null;
	for (let i = 0; i < search.length; i++) {
		const pixel = search[i];

		// Prevent wrap around edge following
		const doNotFollow = (pixel.index % (imageData.width * 4)) === 0 || (pixel.index % (imageData.width * 4)) === ((imageData.width - 1) * 4);
		if (doNotFollow) {
			continue;
		}

		if (pixel.value === 255) {
			if (previousPixel === null) {
				return null;
			}

			// Don't follow already traveled lines.
			if (previousPixel?.value === 1) {
				continue;
			}

			// Prevent a new line starting on the edge which was already followed.
			imageData.data[previousPixel.index] = 1;

			return previousPixel.index;
		}
		previousPixel = pixel;
	}

	return null;
}


/**
 * Helper function to get search index positions.
 *
 * @param {ImageData} imageData
 * @param {number} index The index to search around.
 */
function searchIndexes(imageData, index) {
	return {
		top: index - (imageData.width * 4),
		topRight: index - ((imageData.width - 1) * 4),
		right: index + 4,
		bottomRight: index + ((imageData.width + 1) * 4),
		bottom: index + (imageData.width * 4),
		bottomLeft: index + ((imageData.width - 1) * 4),
		left: index - 4,
		topLeft: index - ((imageData.width + 1) * 4),
	};
}

/**
 * Converts a index position to a x/y position.
 *
 * @param {number} width
 * @param {number} height
 * @param {number} index
 *
 * @returns {[x: number, y: number]}
 */
export function indexToXY(width, height, index) {
	return [
		Math.floor((index / 4) % height + 1),
		Math.floor((index / 4) / width + 1)
	];
}
