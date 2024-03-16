/**
 * @typedef {Object} RenderTime
 * @property {number} lastUpdate
 * @property {number} now
 * @property {number} nextUpdate
 * @property {number} progress 
 */

/**
 * @typedef {(ctx: CanvasRenderingContext2D) => void} CanvasAppSetup
 */

/**
 * @typedef {() => void} CanvasAppUpdate
 */

/**
 * @typedef {(ctx: CanvasRenderingContext2D, time: RenderTime) => void} CanvasAppRender
 */

/**
 * @typedef {Object} Options Canvas App configuration options
 * @property {number} [width] Width of the canvas in pixels. Default is 800.
 * @property {number} [height] Height of the canvas in pixels. Default is 600.
 * @property {number} [updateRate] Desired simulation frames per second. Default is 60. Actual simulation rate may be lower depending on the browser, device and system load.
 * @property {number} [frameRate] Desired rendered frames per second. Default unlimited framerate. Actual frame rate may be lower then specified depending on the browser, device and system load.
 * @property {CanvasAppSetup} [setup] The setup function to be called once before the first frame is rendered.
 * @property {CanvasAppUpdate} [update] The update function to be called once per simulation frame.
 * @property {CanvasAppRender} render The render function to be called once per frame.
 */

/**
 * @typedef {Object} CanvasLoopControls
 * @property {() => void} play Start the animation loop.
 * @property {() => void} pause Stop the animation loop.
 * @property {() => void} step Perform a single step of the animation loop.
 */

/**
 * @typedef {Object} CanvasApp
 * @property {(selector: string) => CanvasLoopControls} mount Mount the app to a container element.
 * @property {() => void} unmount Unmount the app from the container element.
 */

/**
 * Create a new canvas app using the 3d context api.
 *
 * @param {Readonly<Options>} options The configuration options for the app.
 * @returns {CanvasApp} A new canvas app instance.
 */
function canvasApp(options) {
	const canvas = document.createElement('canvas');
	canvas.width = options.width || 800;
	canvas.height = options.height || 600;

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Could not get 2d context from canvas');
	}

	/** @type {HTMLElement|null} */
	let appContainer = null;
	/** @type {CanvasLoopControls|null} */
	let loopControls = null;

	return {
		mount(selector = "#app") {
			if (appContainer) {
				throw new Error('App is already mounted. Unmount before mounting again.');
			}

			appContainer = document.querySelector(selector);
			if (!appContainer) {
				throw new Error(`Canvas container not found using selector: "${selector}"`);
			}

			appContainer.innerHTML = '';
			appContainer.appendChild(canvas);

			loopControls = createLoopControls(options, ctx);

			return loopControls
		},
		unmount() {
			if (!appContainer) {
				throw new Error('App is not mounted.');
			}

			if (!loopControls) {
				throw new Error('Loop controls not defined.');
			}

			loopControls.pause();
			appContainer.innerHTML = '';

			appContainer = null;
			loopControls = null;
		}
	}
}

/**
 * Creates the canvas app control loop.
 *
 * @param {Readonly<Options>} options The configuration options for the app.
 * @param {CanvasRenderingContext2D} ctx The 2d context of the canvas.
 * @returns {CanvasLoopControls} The canvas app control loop.
 */
function createLoopControls(options, ctx) {
	const updateRate = options.updateRate || 60;
	const updateInterval = 1000 / updateRate;
	let previousUpdateTime = 0;

	const frameRate = options.frameRate || 60;
	const frameInterval = 1000 / frameRate;
	let previousFrameTime = 0;

	let isPlaying = false;

	options?.setup?.(ctx);

	/**
	 * @param {DOMHighResTimeStamp} now 
	 */
	const renderCallback = (now) => {
		if (isPlaying) {
			requestAnimationFrame(renderCallback);
		}

		if (options.update) {
			const elapsedUpdateTime = now - previousUpdateTime;
			if (elapsedUpdateTime > updateInterval) {
				previousUpdateTime = now - (elapsedUpdateTime % updateInterval);
				options.update();
			}
		}


		/** @type {RenderTime} */
		const renderTime = {//TODO this is wrong. Fix once needed!
			lastUpdate: previousUpdateTime,
			now: now - previousFrameTime,
			nextUpdate: previousUpdateTime + updateInterval,
			progress: now / (previousUpdateTime + updateInterval)
		}

		const elapsedFrameTime = now - previousFrameTime;
		if (!options.frameRate) {
			options.render(ctx, renderTime);

		} else if (elapsedFrameTime > frameInterval) {
			previousFrameTime = now - (elapsedFrameTime % frameInterval);
			options.render(ctx, renderTime);
		}
	}

	return {
		play() {
			if (isPlaying) {
				return;
			}

			isPlaying = true;
			requestAnimationFrame(renderCallback);
		},
		pause() {
			if (!isPlaying) {
				return;
			}

			isPlaying = false;
		},
		step() {
			isPlaying = false;
			renderCallback(performance.now());
		}
	}
}

export {
	canvasApp
}