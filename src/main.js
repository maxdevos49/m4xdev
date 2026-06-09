import express from "express";
import { env as environment } from "./env.js";
import helmet from "helmet";
import path from "node:path";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * 404 handler
 *
 * @param {Request} _
 * @param {Response} res
 * @param {NextFunction} __
 */
function notFoundHandler(_, res, __) {
	res.status(404).send("This is not the url you are looking for.");
}

/**
 * 500 handler
 *
 * @param {unknown} error
 * @param {Request} _
 * @param {Response} res
 * @param {NextFunction} __
 */
function internalErrorHandler(error, _, res, __) {
	console.error(error);

	res.status(500).send("Internal Server Error");
}

/**
 * @param {typeof environment} env
 */
function main(env) {
	const dir = path.join(process.cwd(), "src");

	const app = express();
	app.use(helmet());
	app.use(express.static(path.join(dir, "public")));

	app.get("/", (_, res) => {
		res.status(200).sendFile(path.join(dir, "views", "home.html"));
	});

	app.get("/librarian-planner", (_, res) => {
		res.status(200).sendFile(path.join(dir, "views", "librarian-planner.html"));
	});

	app.get("/health", (_, res) => {
		res.status(200).send("ok");
	});

	app.use(notFoundHandler);
	app.use(internalErrorHandler);

	app.listen(env.PORT, () => {
		console.log(`Listening at  http://127.0.0.1:${env.PORT}`);
	});
}

main(environment);
