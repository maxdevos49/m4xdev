/**
 * Generates lines for tracing a image.
 *
 * @param {ImageData} imageData
 */
export function TraceImage(imageData) {
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

	// Stats change:
	// Lines: 1177 -> 232
	// Points; 5248 -> 4303

	// Attempt to connect lines sharing points
	outer_loop: for (let i = lines.length - 1; i >= 0; i--) {
		const primaryLine = lines[i];
		const primaryLineStart = primaryLine[0];
		const primaryLineEnd = primaryLine[primaryLine.length - 1];

		for (let j = lines.length - 1; j >= 0; j--) {
			if (i === j) {
				continue;
			}

			const secondaryLine = lines[j];
			const secondaryLineStart = secondaryLine[0];
			const secondaryLineEnd = secondaryLine[secondaryLine.length];

			if (primaryLineEnd === secondaryLineStart) {
				const tempArray = lines.splice(j, 1)[0];
				tempArray.shift();
				primaryLine.push(...tempArray);
				continue outer_loop;
			}

			if (primaryLineStart === secondaryLineEnd) {
				const tempArray = lines.splice(i, 1)[0];
				tempArray.shift();
				secondaryLine.push(...tempArray);
				continue outer_loop;
			}
		}
	}

	return lines
		.map(l => optimizeLine(imageData.width, imageData.height, l))
		.filter(l => {
			let distance = 0;

			/**
			 * Gets the distance between two points.
			 *
			 * @param {number} point1
			 * @param {number} point2
			 */
			const measure = (point1, point2) => {
				const [x1, y1] = indexToXY(imageData.width, imageData.height, point1);
				const [x2, y2] = indexToXY(imageData.width, imageData.height, point2);

				return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
			};

			for (let i = 1; i < l.length; i++) {
				distance += measure(l[i - 1], l[i]);
			}

			return distance > 5;
		});
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

	/**@type {{value: number, index: number}|undefined} */
	let currentPixel, previousPixel;
	while ((currentPixel = search.shift())) {

		// Prevent wrap around edge following
		const doNotFollow = (currentPixel.index % (imageData.width * 4)) === 0 || (currentPixel.index % (imageData.width * 4)) === ((imageData.width - 1) * 4);
		if (doNotFollow) {
			continue;
		}

		if (currentPixel.value === 255) {
			if (!previousPixel) {
				return null;
			}

			// Don't follow already traveled lines.
			if (previousPixel.value === 1) {
				continue;
			}

			// Prevent a new line starting on the edge which was already followed.
			imageData.data[previousPixel.index] = 1;

			return previousPixel.index;
		}
		previousPixel = currentPixel;
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

/**
 * Attempts to reduce the total amount of points required to represent a line without losing detail.
 *
 * @param {number} width Image width
 * @param {number} height Image height
 * @param {Array<number>} line line points stored in a 1 dimensional array.
 */
function optimizeLine(width, height, line) {
	if (line.length < 2) {
		return line;
	}

	for (let i = line.length - 1; i >= 0; i--) {
		const [cX, cY] = indexToXY(width, height, line[i]);
		const [pX, pY] = indexToXY(width, height, line[i - 1]);
		const [spX, spY] = indexToXY(width, height, line[i - 2]);

		const currentSlope = (cY - pY) / (cX - pX);
		const previousSlope = (pY - spY) / (pX - spX);

		if (
			(cY === pY && pY === spY)  // Remove redundant horizontal points
			|| (cX === pX && pX === spX) // Remove redundant vertical points
			|| (currentSlope - previousSlope === 0)  // Remove redundant diagonal points
		) {
			line.splice(i - 1, 1);
		}
	}


	return line;
}
