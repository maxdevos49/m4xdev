import './app.css';
import App from './App.svelte';
// import { Particle, Simulation } from './nbody';

const app = new App({
	target: document.getElementById('app')
});

// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d');

// const bounds = { x: 0, y: 0, width: canvas.width, height: canvas.height };

// const particles = [];
// for (let i = 0; i < 100; i++) {
// 	const x = Math.random() * canvas.width;
// 	const y = Math.random() * canvas.height;
// 	const vx = (Math.random() - 0.5) * 100;
// 	const vy = (Math.random() - 0.5) * 100;
// 	const m = 1;
// 	const p = new Particle(x, y, vx, vy, m);
// 	particles.push(p);
// }

// const sim = new Simulation(particles, bounds);

// function update(dt) {
// 	sim.update(dt);
// 	sim.render(ctx);
// 	// requestAnimationFrame(update);
// }
// let time = 0;
// window.addEventListener('click', () => {
// 	update(time++);
// });
// update(time++);

export default app;
