import {VectorUtil} from "./vector.js";

/**
 * @typedef {object} Particle
 * @property {number} mass
 * @property {import("./vector.js").Vector} position
 * @property {import("./vector.js").Vector} velocity
 */


/**
 * Utility class to create and manage particles.
 *
 * @static
 */
export class ParticleUtil {

	/**
	 * Constructs a new Particle object literal.
	 *
	 * @param {number} mass
	 * @param {import("./vector.js").Vector} position
	 * @param {import("./vector.js").Vector} velocity
	 *
	 * @returns {Particle}
	 */
	static create(mass, position, velocity = VectorUtil.create()) {
		return {
			mass,
			position,
			velocity
		};
	}

	/**
	 * Applies a force to a particle.
	 *
	 * @param {Particle} particle
	 * @param {import("./vector.js").Vector} netForce
	 *
	 * @returns {Particle}
	 */
	static applyForce(particle, netForce) {
		// acceleration = netForce/mass
		const acceleration = VectorUtil.div(netForce, particle.mass);
		particle.velocity = VectorUtil.add(acceleration, particle.velocity);
		particle.position = VectorUtil.add(particle.velocity, particle.position);

		return particle;
	}

	/**
	 * Creates a deep copy of the particle.
	 *
	 * @param {Particle} particle
	 *
	 * @returns {Particle}
	 */
	static clone(particle) {
		return {
			mass: particle.mass,
			position: VectorUtil.create(particle.position.x, particle.position.y, particle.position.z),
			velocity: VectorUtil.create(particle.velocity.x, particle.velocity.y, particle.velocity.z)
		};
	}
}
