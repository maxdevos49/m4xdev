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
import {Particle} from "./structures/particle.js";
import {Rectangle} from "./structures/rectangle.js";
import {Vector} from "./structures/vector.js";

/**
 * Generates a random position within a circle.
 *
 * @param {Vector} center
 * @param {number} radius
 *
 * @returns {Vector}
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
			return new Vector(x, y);
		}
	}
}

/**
 * Calculates the required velocity for a particle to achieve a circular orbit from a given distance.
 *
 * @param {number} gravityConstant
 * @param {number} centralMass
 * @param {number} distance
 */
function calculateCircularOrbitMagnitude(gravityConstant, centralMass, distance) {
	return Math.sqrt((gravityConstant * centralMass) / distance);
}


/**
 * Calculates the gravitational attraction force between two particles.
 *
 * @param {number} gravityConstant
 * @param {number} dampeningConstant
 * @param {Particle} body1
 * @param {Particle} body2
 *
 * @returns {Vector}
 */
function calculateGravitationForce(gravityConstant, dampeningConstant, body1, body2) {
	const directionVector = Vector.sub(body1.position, body2.position);
	const distance = Math.max(Vector.mag(directionVector), dampeningConstant);

	// - G ((m1 * m2) / (magnitude^2))
	const forceScalar = -gravityConstant * ((body1.mass * body2.mass) / (distance * distance));

	return directionVector.normalize().mult(forceScalar);
}



function main() {
	/**@type {HTMLCanvasElement|null} */
	const canvas = document.querySelector("canvas#nbody-canvas");
	if (canvas === null) {
		throw new Error("Failed to find canvas#nbody-canvas");
	}

	const ctx = canvas.getContext("2d");
	if (ctx === null) {
		throw new Error("Failed to get CanvasRenderingContext2D for the element \"canvas#nbody-canvas\"");
	}

	const renderBounds = new Rectangle(0, 0, canvas.width, canvas.height);

	const particleCount = bindInput("#nbody-particle-count");
	const gravityConstant = bindInput("#nbody-gravity");
	const blackholeMass = bindInput("#nbody-blackhole-mass");
	const starMass = bindInput("#nbody-star-mass");
	const simulationScale = bindInput("#nbody-simulation-scale");
	const simulationDampening = bindInput("#nbody-simulation-dampening");

	createEffect([
		particleCount,
		gravityConstant,
		blackholeMass,
		starMass,
		simulationScale,
		simulationDampening
	], () => {
		const particles = Array.from(Array(Number(particleCount.get())))
			.map(() => {
				const position = generateCirclePosition(new Vector(), (renderBounds.width / (3 / 2)) * Number(simulationScale.get()));

				const velocity = Vector.cross(position, new Vector(0, 0, 1))
					.normalize()
					.mult(calculateCircularOrbitMagnitude(
						Number(gravityConstant.get()),
						Number(blackholeMass.get()),
						new Vector().sub(position).mag()
					) * Number(simulationScale.get()));

				return new Particle(Number(starMass.get()), position, velocity);
			});

		// Super massive blackhole!
		particles.push(new Particle(Number(blackholeMass.get()), new Vector()));

		let nextParticles = particles;

		/**
		 * Updates a frame of the simulation.
		 *
		 * @param {Particle[]} currentParticles
		 */
		const update = (currentParticles) => {
			/**@type {Particle[]} */
			const updatedParticles = [];

			for (let i = 0; i < currentParticles.length; i++) {
				const combinedForces = new Vector();

				for (let j = 0; j < currentParticles.length; j++) {
					if (i == j) {
						continue;
					}

					combinedForces.add(calculateGravitationForce(
						Number(gravityConstant.get()),
						Number(simulationDampening.get()),
						currentParticles[i],
						currentParticles[j]
					));
				}

				if (currentParticles[i].mass === Number(blackholeMass.get())) {
					updatedParticles.push(currentParticles[i].clone());
				} else {
					updatedParticles.push(currentParticles[i]
						.clone()
						.applyForce(combinedForces)
					);
				}
			}

			return updatedParticles;
		};


		let nextAnimationFrame = 0;
		const render = () => {
			nextParticles = update(nextParticles);

			ctx.fillStyle = "black";
			ctx.fillRect(renderBounds.x, renderBounds.y, renderBounds.width, renderBounds.height);

			ctx.save();
			ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

			for (const particle of nextParticles) {
				if (particle.mass === Number(blackholeMass.get())) {
					ctx.fillStyle = "red";
				} else {
					ctx.fillStyle = "white";
				}

				ctx.fillRect((particle.position.x / Number(simulationScale.get())) - 1, (particle.position.y / Number(simulationScale.get())) - 1, 2, 2);
			}

			ctx.restore();

			nextAnimationFrame = requestAnimationFrame(render);
		};

		nextAnimationFrame = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(nextAnimationFrame);
		};
	});
}

main();

