export class Simulation {
	particles: Particle[];
	quadtree: Quadtree;
	bounds: { x: number; y: number; width: number; height: number };
	G: number = 6.674 * Math.pow(10, -11);

	constructor(particles: Particle[], bounds: { x: number; y: number; width: number; height: number }) {
		this.particles = particles;
		this.quadtree = new Quadtree(bounds.x, bounds.y, Math.max(bounds.width, bounds.height), 5, 5, 5);
		this.bounds = bounds;
		for (const p of particles) {
			this.quadtree.insert(p);
		}
	}

	update(dt: number) {
		// Clear the quadtree and insert all particles
		this.quadtree.clear();
		for (const p of this.particles) {
			this.quadtree.insert(p);
		}

		// Calculate the forces between particles using the quadtree
		for (const p of this.particles) {
			// Get the particles that are close to this one
			const nearbyParticles = this.quadtree.query(new Rectangle(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2));

			// Calculate the total force on this particle from nearby particles
			let fx = 0;
			let fy = 0;
			for (const other of nearbyParticles) {
				if (other === p) continue;
				const dx = other.x - p.x;
				const dy = other.y - p.y;
				const d = Math.sqrt(dx * dx + dy * dy);
				const f = (this.G * p.mass * other.mass) / (d * d);
				fx += (f * dx) / d;
				fy += (f * dy) / d;
			}

			// Update the particle's velocity and position using the calculated force
			p.vx += (fx * dt) / p.mass;
			p.vy += (fy * dt) / p.mass;
			p.x += p.vx * dt;
			p.y += p.vy * dt;

			// Wrap particle position around the edges of the bounds if it goes out of bounds
			if (p.x < this.bounds.x) p.x += this.bounds.width;
			if (p.x >= this.bounds.x + this.bounds.width) p.x -= this.bounds.width;
			if (p.y < this.bounds.y) p.y += this.bounds.height;
			if (p.y >= this.bounds.y + this.bounds.height) p.y -= this.bounds.height;
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for (const p of this.particles) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
}

export class Quadtree {
	x: number;
	y: number;
	size: number;
	particles: Particle[];
	nw: Quadtree | null;
	ne: Quadtree | null;
	sw: Quadtree | null;
	se: Quadtree | null;
	maxParticles: number;
	maxLevels: number;
	level: number;
	bounds: Rectangle;

	constructor(x: number, y: number, size: number, maxParticles: number, maxLevels: number, level = 0) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.particles = [];
		this.nw = null;
		this.ne = null;
		this.sw = null;
		this.se = null;
		this.maxParticles = maxParticles;
		this.maxLevels = maxLevels;
		this.level = level;
		this.bounds = new Rectangle(this.x, this.y, this.size, this.size);
	}

	split() {
		const nextLevel = this.level + 1;
		const subWidth = this.size / 2;
		const x = this.x;
		const y = this.y;

		this.nw = new Quadtree(x, y, subWidth, this.maxParticles, this.maxLevels, nextLevel);
		this.ne = new Quadtree(x + subWidth, y, subWidth, this.maxParticles, this.maxLevels, nextLevel);
		this.sw = new Quadtree(x, y + subWidth, subWidth, this.maxParticles, this.maxLevels, nextLevel);
		this.se = new Quadtree(x + subWidth, y + subWidth, subWidth, this.maxParticles, this.maxLevels, nextLevel);

		for (const p of this.particles) {
			this.nw.insert(p);
			this.ne.insert(p);
			this.sw.insert(p);
			this.se.insert(p);
		}

		this.particles = [];
	}

	insert(p: Particle) {
		if (!this.bounds.contains(p)) return;

		// If this node doesn't have any children, add the particle to it
		if (!this.nw) {
			this.particles.push(p);

			// Split this node into four children if it has too many particles
			if (this.particles.length > this.maxParticles && this.level < this.maxLevels) {
				this.split();
			}
		} else {
			// Otherwise, add the particle to the appropriate child node
			this.nw.insert(p);
			this.ne.insert(p);
			this.sw.insert(p);
			this.se.insert(p);
		}
	}

	query(range: Rectangle): Particle[] {
		const found: Particle[] = [];

		// If the search range doesn't overlap with this node's bounds, return an empty array
		if (!this.bounds.intersects(range)) {
			return found;
		}

		// If this node has children, search them recursively
		if (this.nw) {
			found.push(...this.nw.query(range));
			found.push(...this.ne.query(range));
			found.push(...this.sw.query(range));
			found.push(...this.se.query(range));
		} else {
			// Otherwise, check each particle in this node
			for (const p of this.particles) {
				if (range.contains(p)) {
					found.push(p);
				}
			}
		}

		return found;
	}

	clear() {
		this.particles = [];
		if (this.nw) {
			this.nw.clear();
			this.ne.clear();
			this.sw.clear();
			this.se.clear();
		}
		this.nw = null;
		this.ne = null;
		this.sw = null;
		this.se = null;
	}
}

export class Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	contains(p: Particle): boolean {
		return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height;
	}

	intersects(range: Rectangle): boolean {
		return !(range.x > this.x + this.width || range.x + range.width < this.x || range.y > this.y + this.height || range.y + range.height < this.y);
	}
}

export class Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
	mass: number;

	constructor(x: number, y: number, vx: number, vy: number, mass: number) {
		this.x = x;
		this.y = y;
		this.r = 5;
		this.vx = vx;
		this.vy = vy;
		this.mass = mass;
	}

	updatePosition(dt: number) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}

	updateVelocity(ax: number, ay: number, dt: number) {
		this.vx += ax * dt;
		this.vy += ay * dt;
	}
}
