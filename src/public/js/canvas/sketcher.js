/**
 * Provides a simple canvas line drawing api.
 *
 * @param {CanvasRenderingContext2D} ctx Canvas context
 *
 * @example ```js
 * const pen = sketcher(ctx);
 *
 * pen.down(10,10);
 * pen.move(100,100);
 * pen.up();
 * ```
 *
 */
export function Sketcher(ctx) {
	const colors = ["red", "orange", "green", "blue", "purple", "black"];

	const state = {
		down: false,
		x: 0,
		y: 0,
		color: "red",
	};

	return {
		/**
		 * Place the pen at the given position without drawing.
		 *
		 * @param {number} x
		 * @param {number} y
		 */
		down(x, y) {
			state.down = true;
			state.x = x;
			state.y = y;
			const temp = colors.shift();
			if (!temp) {
				throw new Error("Missing color");
			}
			colors.push(state.color);
			state.color = temp;
		},
		/**
		 * Move the pen to the given position. Draws a line if the pen is down.
		 *
		 * @param {number} x
		 * @param {number} y
		 */
		move(x, y) {
			if (state.down) {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(state.x, state.y);
				ctx.lineTo(x, y);
				ctx.lineWidth = 1;
				ctx.strokeStyle = state.color;
				ctx.stroke();
				ctx.restore();
			}

			state.x = x;
			state.y = y;
		},
		/**
		 * Raises the pen.
		 */
		up() {
			state.down = false;
		}
	};
}
