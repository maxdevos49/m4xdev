import type { Vector } from '@m4xdev/vector';

class Cube {
	public x: number;
	public y: number;
	public z: number;
	public l: number;

	constructor(x: number, y: number, z: number, l: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.l = l;
	}

	public contains(point: Vector): boolean {
		if (point.x < this.x || point.x > this.x + this.l) {
			return false;
		}

		if (point.y < this.y || point.y > this.y + this.l) {
			return false;
		}

		if (point.z < this.z || point.z > this.z + this.l) {
			return false;
		}

		return true;
	}

	public intersect(cube: Cube): boolean {
		return cube.x + cube.l < this.x || this.x + this.l < cube.x || cube.y + cube.l < this.y || this.y + this.l < cube.y || cube.z + cube.l < this.z || this.z + this.l < cube.z;
	}

	public show(ctx: CanvasRenderingContext2D) {
		ctx.save();

		ctx.strokeStyle = 'white';
		ctx.strokeRect(this.x, this.y, this.l, this.l);

		ctx.restore();
	}
}

export { Cube };
