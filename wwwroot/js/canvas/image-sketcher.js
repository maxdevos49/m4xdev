/**
 * Provides generators for sketching the hard edges in an image.(Incomplete)
 *
 * @param {ImageData} imageData
 */
export function ImageSketcher(imageData) {
	/** @type {Array<Array<number>>} */
	const lines = [];
	const data = imageData.data;

	let previousPixel = data[0];
	for (let i = 0; i < data.length; i += 4) {
		const currentPixel = data[i];

		if (previousPixel === 0 && currentPixel === 255) {
			/** @type {number|null} */
			let point = i - 4;
			const line = [point];

			do {
				const offsets = searchIndexes(imageData, point);
				const normal = normalDirection(imageData, offsets);

				if (normal === null) {
					break;
				}

				point = nextEdgePoint(imageData, offsets, normal);

				if (point !== null) {
					const previous = line[line.length - 1];

					//TODO improve point deduping.
					if (line.length > 1 && Math.abs(point - previous) === imageData.width) {// Dedupe vertical lines
						line[line.length - 1] = point;
					} else if (line.length > 1 && Math.abs(point - previous) === 4) {// Dedupe horizontal lines
						line[line.length - 1] = point;
					} else {
						if (line.length > 2) {
							const secondPrevious = line[line.length - 2];
							const [x1, y1] = indexToXY(imageData, secondPrevious);
							const [x2, y2] = indexToXY(imageData, previous);
							const previousSlope = (y2 - y1) / (x2 - x1);

							const [x3, y3] = indexToXY(imageData, point);
							const nextSlope = (y3 - y2) / (x3 - x2);
							if (previousSlope === nextSlope) {//TODO fix: sometimes slope is infinity!
								line[line.length - 1] = point;
							} else {
								line.push(point);
							}

						} else {
							line.push(point);
						}
					}

					if (point === line[0]) {
						break;
					}
				}
			} while (point !== null);

			if (line.length > 1) {
				lines.push(line);
			}
		}

		previousPixel = currentPixel;
	}

	return lines;
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
		{value: imageData.data[offsets.top] ?? 0, index: offsets.top},
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

			return previousPixel.index;
		}
		previousPixel = pixel;
	}

	return null;
}


/**
 * Helper function to get search index positions.
 *
 * TODO consider including values in the returned object for the edge search function.
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
 * @param {ImageData} imageData
 * @param {number} index
 *
 * @returns {[x: number, y: number]}
 */
export function indexToXY(imageData, index) {
	return [
		(index / 4) % imageData.height + 1,
		(index / 4) / imageData.width + 1
	];
}
