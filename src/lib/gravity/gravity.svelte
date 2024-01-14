<script lang="ts">
	import { onMount } from 'svelte';
	import { Particle3D, type Particle, type ParticleAttributes } from '@m4xdev/particle';
	import { Vector3 } from '@m4xdev/vector';

	// Formulas:
	// - KE=1/2mv^2
	// - vf(m1 + m2) = m1v1 + m2v2

	type StarAttributes = {
		mass: number;
		color: string;
		removeFromSim?: boolean;
	} & ParticleAttributes;

	const scale = 0.1;
	const maxStars = 1000;
	const maxMass = 10000;

	let canvas: HTMLCanvasElement;

    function diameter(mass: number, maximumMass: number): number {
        // Smallest size is 10px
        // Largest size is 60px
        // x/50 = mass/maximumMass where x is greater then 10 and less then 50
        return Math.trunc(mass/maximumMass * 50 + 10);
    }

	onMount(() => {
		const width = window.visualViewport.width / scale;
		const height = window.visualViewport.height / scale;

		const top = -(height / 2);
		const left = -(width / 2);
		const right = left + width;
		const bottom = top + height;

		const back = -(width / 2);
		const front = back + width;

		canvas.width = window.visualViewport.width;
		canvas.height = window.visualViewport.height;

		const ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;

		let particles: Particle<StarAttributes>[] = [];
        let initialTotalMass = 0;
		// // Center Star
		// particles.push(
		// 	Particle3D.create(Vector3.create(), Vector3.create(), {
		// 		color: 'red',
		// 		mass: maxMass,
		// 		static: true
		// 	})
		// );

		for (let i = 0; i < maxStars; i++) {
			const mass = Math.ceil(Math.random() * maxMass);
            initialTotalMass += mass;
			const magnitude = Math.floor(Math.random() * 10) + 1000;
			const position = Vector3.mult(Vector3.normalize(Vector3.random()), magnitude);
			position.z = 0
            
            // if (position.y > 0) {
			// 	position.y = Math.min(position.y, 100);
			// } else {
			// 	position.y = Math.max(position.y, -100);
			// }
			const velocity = Vector3.mult(Vector3.normalize(Vector3.cross(position, Vector3.create(0, 0, 1))), 1);

			particles.push(
				Particle3D.create<StarAttributes>(position, velocity, {
					mass,
					color: getRandomHexColor()
				})
			);
		}

        console.log("Initial Mass", initialTotalMass);

		setInterval(() => {
			particles = update(particles);
		}, 5);

		const update = (existingParticles: Particle<StarAttributes>[]) => {
			const newParticles: Particle<StarAttributes>[] = [];

			for (let self = existingParticles.length; self--; ) {
				const forces = [];
				const scalars = [];

				const body1 = existingParticles[self];
				if (body1.attributes.removeFromSim) {
					continue;
				}

				for (let other = existingParticles.length; other--; ) {
					if (other === self) {
						continue;
					}
					const body2 = existingParticles[other];
					if (body2.attributes.removeFromSim) {
						continue;
					}

					const directionVector = Vector3.sub(body1.position, body2.position);
					const directionUnitVector = Vector3.normalize(directionVector);
					const distance = Vector3.mag(directionVector);

					// - G ((m1 * m2) / (magnitude^2))
					const forceScalar = -0.0000001 * ((body1.attributes.mass * body2.attributes.mass) / (distance * distance));

					forces.push(Vector3.mult(directionUnitVector, forceScalar));

                    const touchingDistance = diameter(body1.attributes.mass, maxMass) + diameter(body2.attributes.mass, maxMass); 
					if (distance <= touchingDistance && !body2.attributes.static && body1.attributes.mass > body2.attributes.mass) {
						// Inelastic collision formula.
						// vf(m1 + m2) = m1v1 + m2v2
						const m1v1 = Vector3.mult(body1.velocity, body1.attributes.mass);
						const m2v2 = Vector3.mult(body2.velocity, body2.attributes.mass);

						body1.velocity = Vector3.add(m1v1, m2v2);
						body1.attributes.mass = body1.attributes.mass + body2.attributes.mass;

						body2.attributes.removeFromSim = true;

						break;
					}

					// if (body1.position.x < left) {
					// 	body1.position.x = left;
					// 	body1.velocity.x = 1;
					// } else if (body1.position.x > right) {
					// 	body1.position.x = right;
					// 	body1.velocity.x = -1;
					// }

					// if (body1.position.y < top) {
					// 	body1.position.y = top;
					// 	body1.velocity.y = 1;
					// } else if (body1.position.y > bottom) {
					// 	body1.position.y = bottom;
					// 	body1.velocity.y = -1;
					// }

					// if (body1.position.z < back) {
					// 	body1.position.z = back;
					// 	body1.velocity.z = 1;
					// } else if (body1.position.z > front) {
					// 	body1.position.z = front;
					// 	body1.velocity.z = -1;
					// }
				}

				const sumOfForces = forces.reduce((desiredVelocity, force) => Vector3.add(desiredVelocity, force), Vector3.create());

				const productOfScalars = scalars.reduce((desiredScalar, scalar) => desiredScalar * scalar, 1);

				const newParticle = Particle3D.applyScalar(Particle3D.applyForce(body1, sumOfForces), productOfScalars);
				newParticles.push(Particle3D.step(newParticle));
			}
			return newParticles.filter((p) => !p.attributes.removeFromSim);
		};

		let lt = 0;
		let fps = 0;

		const render: FrameRequestCallback = (t) => {
			requestAnimationFrame(render);

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.save();
			ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
			ctx.scale(scale, scale);

			ctx.strokeStyle = 'red';
			ctx.strokeRect(-(width / 2), -(height / 2), width, height);

			// const maxDistance = -1000;
			// const closestDistance = 1000;
            let totalMass = 0;

			particles.forEach((p) => {
				// const shade = Math.floor(((p.position.z - closestDistance) / (maxDistance - closestDistance)) * 255)
				// 	.toString(16)
				// 	.padStart(2, '0');

                totalMass += p.attributes.mass;

				// let color = `#${shade}${shade}${shade}`;
				let color = p.attributes.color;
				let size = 1;
				if (p.attributes.static) {
					color = 'white';
					size = 20;
				} else {
					size = Math.max(p.attributes.mass * 0.001, 3);
				}

                
				const offset = Math.floor(size / 2);
				
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.position.x-offset, p.position.y-offset, diameter(p.attributes.mass, maxMass)/2, 0, Math.PI * 2);
                ctx.fill();
			});
            console.log("Mass in system:", totalMass);
			// ctree.render(ctx);

			ctx.restore();

			const delta = (t - lt) / 1000;
			lt = t;

			fps = 1 / delta;
		};

		requestAnimationFrame(render);
	});

	function getRandomHexColor(): string {
		// Generate a random number between 0 and 16777215 (FFFFFF in hexadecimal)
		const randomNum = Math.floor(Math.random() * 16777215);

		// Convert the random number to a hexadecimal string and add leading zeros if necessary
		const hexString = randomNum.toString(16).padStart(6, '0');

		// Return the hex color string with a leading hash symbol
		return '#' + hexString;
	}
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
