import type { Particle, ParticleAttributes } from '@m4xdev/particle';
import { Cube } from './cube';

class CubeTree<TParticleAttribute extends ParticleAttributes> {
	private bounds: Cube;
	private capacity: number;
	private particles: Particle<TParticleAttribute>[];
	private divided: boolean;

	// Foreground
	private qf1: CubeTree<TParticleAttribute> | null;
	private qf2: CubeTree<TParticleAttribute> | null;
	private qf3: CubeTree<TParticleAttribute> | null;
	private qf4: CubeTree<TParticleAttribute> | null;

	// Background
	private qb1: CubeTree<TParticleAttribute> | null;
	private qb2: CubeTree<TParticleAttribute> | null;
	private qb3: CubeTree<TParticleAttribute> | null;
	private qb4: CubeTree<TParticleAttribute> | null;

	constructor(bounds: Cube, capacity: number) {
		this.bounds = bounds;
		this.particles = [];
		this.capacity = capacity;
		this.divided = false;

		this.qf1 = null;
		this.qf1 = null;
		this.qf1 = null;
		this.qf1 = null;

		this.qb1 = null;
		this.qb1 = null;
		this.qb1 = null;
		this.qb1 = null;
	}

	public insert(particle: Particle<TParticleAttribute>): boolean {
		if (!this.bounds.contains(particle.position)) {
			return false;
		}

		if (this.particles.length < this.capacity) {
			this.particles.push(particle);
			return true;
		}

		if (!this.divided) {
			this.subdivide();
		}

		if (
			this.qb1.insert(particle) ||
			this.qb2.insert(particle) ||
			this.qb3.insert(particle) ||
			this.qb4.insert(particle) ||
			this.qf1.insert(particle) ||
			this.qf2.insert(particle) ||
			this.qf3.insert(particle) ||
			this.qf4.insert(particle)
		) {
			return true;
		}

		return false;
	}

	public query(selection: Cube): Particle<TParticleAttribute>[] {
		return [];
	}

	private subdivide() {
		const nl = this.bounds.l / 2;

		this.qb1 = new CubeTree(new Cube(this.bounds.x + nl, this.bounds.y, this.bounds.z + nl, nl), this.capacity);
		this.qb2 = new CubeTree(new Cube(this.bounds.x, this.bounds.y, this.bounds.z + nl, nl), this.capacity);
		this.qb3 = new CubeTree(new Cube(this.bounds.x, this.bounds.y + nl, this.bounds.z + nl, nl), this.capacity);
		this.qb4 = new CubeTree(new Cube(this.bounds.x + nl, this.bounds.y + nl, this.bounds.z + nl, nl), this.capacity);

		this.qf1 = new CubeTree(new Cube(this.bounds.x + nl, this.bounds.y, this.bounds.z, nl), this.capacity);
		this.qf2 = new CubeTree(new Cube(this.bounds.x, this.bounds.y, this.bounds.z, nl), this.capacity);
		this.qf3 = new CubeTree(new Cube(this.bounds.x, this.bounds.y + nl, this.bounds.z, nl), this.capacity);
		this.qf4 = new CubeTree(new Cube(this.bounds.x + nl, this.bounds.y + nl, this.bounds.z, nl), this.capacity);

		this.divided = true;
	}

	public render(ctx: CanvasRenderingContext2D) {
		if (this.particles.length === 0) {
			return;
		}

		this.bounds.show(ctx);

		this.qb1?.render(ctx);
		this.qb2?.render(ctx);
		this.qb3?.render(ctx);
		this.qb4?.render(ctx);

		this.qf1?.render(ctx);
		this.qf2?.render(ctx);
		this.qf3?.render(ctx);
		this.qf4?.render(ctx);
	}
}

export { CubeTree };
