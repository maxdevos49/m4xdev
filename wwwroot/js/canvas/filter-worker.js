/**
 * Web Worker to apply filters to images. By using this worker the filter can be
 * applied asynchronously on the main thread.
 */

/**
 * @typedef {Object} FilterJob
 * @property {"grayscale" | "sobel"} type
 * @property {ImageData} imageData
 */

/**
 * Applies a filter to an image.
 *
 * @param {FilterJob} job
 */
function filter(job) {
	switch (job.type) {
		case "grayscale":
			return grayScaleFilter(job.imageData);
		case "sobel":
			return sobelFilter(job.imageData);
		default:
			throw new Error(`Unknown filter job type: "${job.type}"`);
	}
}

/**
 * Applies a gray scale filter.
 *
 * @param {ImageData} imageData
 * @returns {ImageData}
 */
function grayScaleFilter(imageData) {
	for (let i = 0; i < imageData.data.length; i += 4) {
		const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
		imageData.data[i] = avg;
		imageData.data[i + 1] = avg;
		imageData.data[i + 2] = avg;
	}

	return imageData;
}

/**
 * Applies a Sober(Edge detection) filter.
 *
 * @param {ImageData} imageData
 * @returns {ImageData}
 */
function sobelFilter(imageData) {
	const xKernel = [1, 0, -1, 2, 0, -2, 1, 0, -1];
	const yKernel = [1, 2, 1, 0, 0, 0, -1, -2, -1];

	const outImage = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);

	const data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		let xSum = 0;
		let ySum = 0;

		const topLeftIndex = i - ((imageData.width + 1) * 4);
		xSum += (data[topLeftIndex] ?? 0) * xKernel[0];
		xSum += (data[topLeftIndex + 4] ?? 0) * xKernel[1];
		xSum += (data[topLeftIndex + 8] ?? 0) * xKernel[2];

		ySum += (data[topLeftIndex] ?? 0) * yKernel[0];
		ySum += (data[topLeftIndex + 4] ?? 0) * yKernel[1];
		ySum += (data[topLeftIndex + 8] ?? 0) * yKernel[2];

		const middleLeftIndex = i - 4;
		xSum += (data[middleLeftIndex] ?? 0) * xKernel[3];
		xSum += (data[middleLeftIndex + 4] ?? 0) * xKernel[4];
		xSum += (data[middleLeftIndex + 8] ?? 0) * xKernel[5];

		ySum += (data[middleLeftIndex] ?? 0) * yKernel[3];
		ySum += (data[middleLeftIndex + 4] ?? 0) * yKernel[4];
		ySum += (data[middleLeftIndex + 8] ?? 0) * yKernel[5];

		const bottomLeftIndex = i + ((imageData.width - 1) * 4);
		xSum += (data[bottomLeftIndex] ?? 0) * xKernel[6];
		xSum += (data[bottomLeftIndex + 4] ?? 0) * xKernel[7];
		xSum += (data[bottomLeftIndex + 8] ?? 0) * xKernel[8];

		ySum += (data[bottomLeftIndex] ?? 0) * yKernel[6];
		ySum += (data[bottomLeftIndex + 4] ?? 0) * yKernel[7];
		ySum += (data[bottomLeftIndex + 8] ?? 0) * yKernel[8];

		const resultX = Math.pow(xSum, 2);
		const resultY = Math.pow(ySum, 2);

		let result = Math.sqrt(resultX + resultY);

		// Cleanup faint edges at the cost of some detail
		if (result < 175) {
			result = 0;
		} else {
			result = 255;
		}

		outImage.data[i] = result;
		outImage.data[i + 1] = result;
		outImage.data[i + 2] = result;
	}

	return outImage;
}

/**
 * @type {(e: MessageEvent<FilterJob>) => void}
 */
self.onmessage = (e) => {
	self.postMessage(filter(e.data));
};

