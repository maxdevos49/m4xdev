import {Vector} from "./vector.js";

export class Particle {
	/**
	 * Constructs an instance of a Vector.
	 *
	 * @param {number} mass
	 * @param {Vector} position
	 * @param {Vector} velocity
	 */
	constructor(mass, position, velocity = new Vector()) {
		/**
		 * The mass of the particle.
		 *
		 * @public
		 * @type {Readonly<number>}
		 */
		this.mass = mass;

		/**
		 * The position of the particle.
		 *
		 * @public
		 * @type {Readonly<Vector>}
		 */
		this.position = position;

		/**
		 * The velocity of the particle.
		 *
		 * @public
		 * @type {Readonly<Vector>}
		 */
		this.velocity = velocity;
	}

	/**
	 * Applies a force to a particle.
	 *
	 * @param {Vector} netForce
	 *
	 * @returns {Particle}
	 */
	applyForce(netForce) {
		// acceleration = netForce/mass
		const acceleration = Vector.div(netForce, this.mass);
		this.velocity.add(acceleration);
		this.position.add(this.velocity);

		return this;
	}

	/**
	 * Creates a deep copy of the particle.
	 *
	 * @returns {Particle}
	 */
	clone() {
		return new Particle(
			this.mass,
			new Vector(this.position.x, this.position.y, this.position.z),
			new Vector(this.velocity.x, this.velocity.y, this.velocity.z)
		);
	}
}
