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

/**
 * Wraps loading an image from a Blob.
 *
 * @param {Blob} blob File blob from a form input[type="file"]
 * @returns {Promise<HTMLImageElement>} A promise containing an image. Throws if loading fails.
 */
export function LoadImageFromBlob(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = reject;

		reader.onload = (e) => {
			const img = new Image();
			if (!e.target?.result || typeof e.target?.result !== "string") {
				throw new Error("Unexpected result type.");
			}

			img.src = e.target.result;

			resolve(img);
		};


		reader.readAsDataURL(blob);
	});
}

