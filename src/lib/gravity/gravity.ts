import type { Particle, ParticleAttributes } from '@m4xdev/particle';
import { type Vector, Vector3 } from '@m4xdev/vector';

type MassAttribute = { mass: number } & ParticleAttributes;

/**
 * Calculates the Gravitational force between two bodies.
 *
 * @param gravityConstant Gravity Constant
 * @param body1
 * @param body2
 */
export function calculateGravitationForce(gravityConstant: number, body1: Particle<MassAttribute>, body2: Particle<MassAttribute>): Vector {
	// # vector between two points(points at each other)
	// position1 - position2
	const directionVector = Vector3.sub(body1.position, body2.position);
	const directionUnitVector = Vector3.normalize(directionVector);
	const distance = Vector3.mag(directionVector);

	// - G ((m1 * m2) / (magnitude^2))
	const forceScalar = -gravityConstant * ((body1.attributes.mass * body2.attributes.mass) / (distance * distance));

	return Vector3.mult(directionUnitVector, forceScalar);
}
