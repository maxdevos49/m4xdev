/**
 * N-body simulation implementing the Barnes-Hut algorithm
 *
 * @author Maxwell DeVos
 *
 * References:
 * @link https://en.wikipedia.org/wiki/Quadtree
 * @link https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation
 * @link https://beltoforion.de/en/barnes-hut-galaxy-simulator/index.php
 * @link https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
 */

import {bindInput} from "./state/bind/input.js";
import {createEffect} from "./state/effect.js";
import {BarnesHutQuadTree} from "./structures/barnes-hut-quad-tree.js";
import {ParticleUtil} from "./structures/particle.js";
import {CircularBuffer} from "./structures/queue.js";
import {Rectangle} from "./structures/rectangle.js";
import {VectorUtil} from "./structures/vector.js";

/**
 * Generates a random position within a circle.
 *
 * @param {import('./structures/vector.js').Vector} center
 * @param {number} radius
 *
 * @returns {import('./structures/vector.js').Vector}
 */
function generateCirclePosition(center, radius) {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const x = Math.random() * (2 * radius) + (center.x - radius);
		const y = Math.random() * (2 * radius) + (center.y - radius);

		// Calculate distance from the center
		let distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);

		// Calculate standard deviation based on distance
		let standardDeviation = radius / 5; // Adjust this factor as needed

		// Calculate probability density using Gaussian distribution
		let probabilityDensity = Math.exp(-(distance ** 2) / (2 * standardDeviation ** 2));

		// Accept the point with probability proportional to the density
		if (Math.random() < probabilityDensity) {
			return VectorUtil.create(x, y);
		}
	}
}

/**
 * Calculates the required velocity for a particle to achieve a circular orbit from a given distance.
 *
 * @param {number} gravityConstant
 * @param {number} totalMass
 * @param {number} distance
 */
function calculateCircularOrbitMagnitude(gravityConstant, totalMass, distance) {
	return Math.sqrt((gravityConstant * totalMass) / distance);
}


/**
 * Calculates the gravitational attraction force between two particles.
 *
 * @param {number} gravityConstant
 * @param {number} dampeningConstant
 * @param {number} mass1
 * @param {import('./structures/vector.js').Vector} position1
 * @param {number} mass2
 * @param {import('./structures/vector.js').Vector} position2
 *
 * @returns {import('./structures/vector.js').Vector}
 */
function calculateGravitationForce(gravityConstant, dampeningConstant, mass1, position1, mass2, position2) {
	const directionVector = VectorUtil.sub(position1, position2);
	const distance = Math.max(VectorUtil.mag(directionVector), dampeningConstant);

	// - G ((m1 * m2) / (magnitude^2))
	const forceScalar = -gravityConstant * ((mass1 * mass2) / (distance * distance));

	return VectorUtil.mult(VectorUtil.normalize(directionVector), forceScalar);
}

/**
 * Calculates the gravitational force applied to a particle.
 *
 * @param {number} gravityConstant
 * @param {number} dampeningConstant
 * @param {number} theta
 * @param {import('./structures/particle.js').Particle} particle
 * @param {BarnesHutQuadTree} qt
 *
 * @returns {import('./structures/vector.js').Vector}
 */
function barnesHutGravitate(gravityConstant, dampeningConstant, theta, particle, qt) {
	if (qt.leaf) {
		if (qt.particle === null || qt.particle === particle) {
			return VectorUtil.create();
		}

		return calculateGravitationForce(
			gravityConstant,
			dampeningConstant,
			particle.mass,
			particle.position,
			qt.particle.mass,
			qt.particle.position,
		);
	}

	const distance = VectorUtil.distance(qt.centerOfMass, particle.position);
	if ((qt.width / distance) < theta) {
		return calculateGravitationForce(
			gravityConstant,
			dampeningConstant,
			particle.mass,
			particle.position,
			qt.totalMass,
			qt.centerOfMass,
		);
	}

	let forces = VectorUtil.create();
	for (const quadrant of qt.quadrants) {
		if (quadrant === null) {
			continue;
		}

		forces = VectorUtil.add(forces, barnesHutGravitate(gravityConstant, dampeningConstant, theta, particle, quadrant));
	}

	return forces;
}


function main() {
	/**@type {HTMLCanvasElement|null} */
	const canvas = document.querySelector("canvas#nbody-canvas");
	if (canvas === null) {
		throw new Error("Failed to find element \"canvas#nbody-canvas\"");
	}

	const ctx = canvas.getContext("2d");
	if (ctx === null) {
		throw new Error("Failed to get CanvasRenderingContext2D for the element \"canvas#nbody-canvas\"");
	}

	const renderBounds = new Rectangle(0, 0, canvas.width, canvas.height);

	const particleCount = bindInput("#nbody-particle-count", Number);
	const gravityConstant = bindInput("#nbody-gravity", Number);
	const blackholeMass = bindInput("#nbody-blackhole-mass", Number);
	const starMass = bindInput("#nbody-star-mass", Number);
	const simulationScale = bindInput("#nbody-simulation-scale", Number);
	const simulationDampening = bindInput("#nbody-simulation-dampening", Number);
	const theta = bindInput("#nbody-theta", Number);

	const SCROLL_SENSITIVITY = 0.0005;
	const MAX_ZOOM = 5;
	const MIN_ZOOM = 0.1;
	let panning = false;
	let zoom = 1;
	const camera = VectorUtil.create(renderBounds.width / 2, renderBounds.height / 2);
	const dragStart = VectorUtil.create();

	canvas.addEventListener("wheel", (e) => {
		e.preventDefault();

		if (panning) {
			return;
		}
		const zoomAmount = e.deltaY * SCROLL_SENSITIVITY;

		zoom -= zoomAmount;

		zoom = Math.min(zoom, MAX_ZOOM);
		zoom = Math.max(zoom, MIN_ZOOM);
	});

	canvas.addEventListener("mousedown", (e) => {
		e.preventDefault();

		panning = true;
		dragStart.x = e.offsetX / zoom - camera.x;
		dragStart.y = e.offsetY / zoom - camera.y;
	});

	canvas.addEventListener("mousemove", (e) => {
		e.preventDefault();

		if (!panning) {
			return;
		}

		camera.x = e.offsetX / zoom - dragStart.x;
		camera.y = e.offsetY / zoom - dragStart.y;
	});

	document.addEventListener("mouseup", () => {
		panning = false;
	});

	createEffect([
		particleCount,
		gravityConstant,
		blackholeMass,
		starMass,
		simulationScale,
		simulationDampening,
		theta
	], () => {
		let simulationBounds = new Rectangle(-canvas.width * 2 * simulationScale.get(), -canvas.height * 2 * simulationScale.get(), canvas.width * 4 * simulationScale.get(), canvas.height * 4 * simulationScale.get());

		/** @type {import('./structures/particle.js').Particle[]} */
		let particles = [];


		const ratio = 3 / 4;

		const blackhole1Mass = blackholeMass.get();
		const galaxy1Stars = particleCount.get() * ratio;
		const galaxy1Position = VectorUtil.create();
		const galaxy1Radius = (simulationBounds.width / 3);

		const blackHole2Mass = blackholeMass.get() * ratio;
		const galaxy2Stars = particleCount.get() - galaxy1Stars;
		const galaxy2Position = VectorUtil.create(
			(renderBounds.width / 2) * 3 * simulationScale.get(),
			(renderBounds.height / 2) * 3 * simulationScale.get()
		);
		const galaxy2Radius = (simulationBounds.width / 3) * ratio;

		const blackhole2Velocity = VectorUtil.mult(
			VectorUtil.normalize(
				VectorUtil.cross(
					galaxy2Position,
					VectorUtil.create(0, 0, 1))
			),
			calculateCircularOrbitMagnitude(
				gravityConstant.get(),
				blackhole1Mass + blackHole2Mass,
				VectorUtil.distance(VectorUtil.create(), galaxy2Position)
			));

		// Blackhole 1 stars
		for (let i = 0; i < galaxy1Stars; i++) {
			const mass = Math.floor(Math.random() * starMass.get()) + 1;
			const position = generateCirclePosition(VectorUtil.create(), galaxy1Radius);
			position.z = 0;

			const velocity = VectorUtil.mult(
				VectorUtil.normalize(
					VectorUtil.cross(
						position,
						VectorUtil.create(0, 0, 1))
				),
				calculateCircularOrbitMagnitude(
					gravityConstant.get(),
					blackhole1Mass + mass,
					VectorUtil.distance(VectorUtil.create(), position)
				));

			particles.push(ParticleUtil.create(
				mass,
				VectorUtil.translate(position, galaxy1Position.x, galaxy1Position.y),
				velocity
			));
		}

		// Blackhole 2 stars
		for (let i = 0; i < galaxy2Stars; i++) {
			const mass = Math.floor(Math.random() * starMass.get()) + 1;
			const position = generateCirclePosition(VectorUtil.create(), galaxy2Radius);
			position.z = 0;

			const velocity = VectorUtil.add(
				VectorUtil.mult(
					VectorUtil.normalize(
						VectorUtil.cross(position, VectorUtil.create(0, 0, 1)))
					, calculateCircularOrbitMagnitude(
						gravityConstant.get(),
						blackHole2Mass + mass,
						VectorUtil.distance(VectorUtil.create(), position)
					)),
				blackhole2Velocity);

			particles.push(ParticleUtil.create(
				mass,
				VectorUtil.translate(position, galaxy2Position.x, galaxy2Position.y),
				velocity
			));
		}

		// Blackhole 1
		particles.push(ParticleUtil.create(blackhole1Mass, galaxy1Position));

		// Blackhole 2
		particles.push(ParticleUtil.create(blackHole2Mass, galaxy2Position, blackhole2Velocity));


		let qt = new BarnesHutQuadTree(simulationBounds);


		/**
		 * Updates a frame of the simulation.
		 *
		 * @param {import('./structures/particle.js').Particle[]} currentParticles
		 *
		 * @returns {[nextParticles: import('./structures/particle.js').Particle[], nextSimulationBounds: Rectangle]}
		 */
		const update = (currentParticles) => {
			let minSimX = Number.POSITIVE_INFINITY;
			let maxSimX = Number.NEGATIVE_INFINITY;
			let minSimY = Number.POSITIVE_INFINITY;
			let maxSimY = Number.NEGATIVE_INFINITY;

			qt = new BarnesHutQuadTree(simulationBounds);

			// Build quad tree
			for (const particle of currentParticles) {
				qt.insert(particle);
			}

			/**@type {import('./structures/particle.js').Particle[]} */
			const updatedParticles = [];

			for (const particle of currentParticles) {
				const nextParticle = ParticleUtil.applyForce(
					ParticleUtil.clone(particle),
					barnesHutGravitate(
						gravityConstant.get(),
						simulationDampening.get(),
						theta.get(),
						particle,
						qt
					));

				minSimX = Math.min(minSimX, nextParticle.position.x);
				maxSimX = Math.max(maxSimX, nextParticle.position.x);

				minSimY = Math.min(minSimY, nextParticle.position.y);
				maxSimY = Math.max(maxSimY, nextParticle.position.y);

				updatedParticles.push(nextParticle);
			}

			const simulationBoundsDimension = Math.max(maxSimX - minSimX, maxSimY - minSimY);

			return [updatedParticles, new Rectangle(minSimX, minSimY, simulationBoundsDimension, simulationBoundsDimension)];
		};

		let step = 0;
		let nextAnimationFrame = 0;
		let previousTime = 0;
		/** @type {CircularBuffer<number>} */
		const previousFrameRates = new CircularBuffer(60);
		/** @type {CircularBuffer<number>} */
		const previousFrameTimes = new CircularBuffer(30);

		/** @param {DOMHighResTimeStamp} time */
		const render = (time) => {
			const [nextParticles, nextSimulationBounds] = update(particles);
			particles = nextParticles;
			simulationBounds = nextSimulationBounds;

			ctx.fillStyle = "black";
			ctx.fillRect(renderBounds.x, renderBounds.y, renderBounds.width, renderBounds.height);

			ctx.save();
			ctx.translate(renderBounds.width / 2, renderBounds.height / 2);
			ctx.scale(zoom, zoom);
			ctx.translate(-renderBounds.width / 2 + camera.x, -renderBounds.height / 2 + camera.y);

			// qt.show(ctx, simulationScale.get());

			for (const particle of particles) {
				const gasSize = 30;
				ctx.fillStyle = "rgba(43, 120, 255, 0.05)";
				ctx.fillRect((particle.position.x / simulationScale.get()) - gasSize / 2, (particle.position.y / simulationScale.get()) - gasSize / 2, gasSize, gasSize);

				const dustColor = [
					// main sequence
					"rgba(1,1,1,0.09)",
					"rgba(1,1,1,0.09)",
					"rgba(1,1,1,0.1)",
					// orange giant
					"rgba(103,78,85,0.05)",
					"rgba(103,78,85,0.05)",
					"rgba(103,78,85,0.08)",
					"rgba(103,78,85,0.08)",
					// red super giant
					"rgba(240, 220, 213, 0.06)",
					"rgba(240, 220, 213, 0.07)",
					"rgba(170, 76, 81, 0.05)",
					"rgba(170, 76, 81, 0.06)",
					"rgba(170, 76, 81, 0.07)",
					"rgba(170, 76, 81, 0.07)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.1)",
					"rgba(170, 76, 81, 0.2)",
					"rgba(170, 76, 81, 0.3)",
				];

				const color = dustColor[Math.floor((dustColor.length * particle.mass) / (starMass.get() + 1))];

				const dustSize = 16;
				ctx.fillStyle = color;
				ctx.fillRect((particle.position.x / simulationScale.get()) - dustSize / 2, (particle.position.y / simulationScale.get()) - dustSize / 2, dustSize, dustSize);

				if (particle.mass === blackhole1Mass || particle.mass === blackHole2Mass) {
					let starSize = 32;
					ctx.fillStyle = "rgba(255, 220, 132, 0.1)";
					ctx.beginPath();
					ctx.ellipse((particle.position.x / simulationScale.get()), (particle.position.y / simulationScale.get()), starSize, starSize, 0, 0, Math.PI * 2);
					ctx.fill();

					starSize = 20;
					ctx.fillStyle = "rgba(255, 220, 132, 0.4)";
					ctx.beginPath();
					ctx.ellipse((particle.position.x / simulationScale.get()), (particle.position.y / simulationScale.get()), starSize, starSize, 0, 0, Math.PI * 2);
					ctx.fill();

					starSize = 14;
					ctx.fillStyle = "rgba(255, 220, 132, 0.7)";
					ctx.beginPath();
					ctx.ellipse((particle.position.x / simulationScale.get()), (particle.position.y / simulationScale.get()), starSize, starSize, 0, 0, Math.PI * 2);
					ctx.fill();
				} else {
					const starSize = 2;
					ctx.fillStyle = "rgba(255, 255, 255, 1)";
					ctx.fillRect((particle.position.x / simulationScale.get()) - starSize / 2, (particle.position.y / simulationScale.get()) - starSize / 2, starSize, starSize);
				}
			}

			ctx.restore();

			const delta = time - previousTime;
			previousFrameTimes.put(delta);
			previousFrameRates.put(1000 / delta);
			previousTime = time;

			const averageFrameTime = previousFrameTimes.data().reduce((acc, v) => acc + v, 0) / previousFrameTimes.data().length;
			const averageFPS = previousFrameRates.data().reduce((acc, v) => acc + v, 0) / previousFrameRates.data().length;

			ctx.font = "16px serif";
			ctx.fillStyle = "white";
			ctx.fillText("FPS: " + averageFPS.toFixed(1), 5, 16);
			ctx.fillText("Frame Time: " + averageFrameTime.toFixed(1) + "ms", 5, 16 * 2);
			ctx.fillText("Step: " + step++, 5, 16 * 3);

			nextAnimationFrame = requestAnimationFrame(render);
		};

		nextAnimationFrame = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(nextAnimationFrame);
		};
	});
}

main();

