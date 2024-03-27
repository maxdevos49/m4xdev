/**
 * Wraps loading an image with a promise.
 *
 * @param {string} src The Image source url.
 * @returns {Promise<HTMLImageElement>} A promise containing an image. Throws if loading fails.
 */
export function LoadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve(img);
		};

		img.onerror = (error) => {
			reject(error);
		};

		img.src = src;
	});
}
