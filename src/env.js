import process from "node:process";
import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().int().positive().default(8080),
});

const result = envSchema.safeParse(process.env);
if (result.error) {
	throw result.error;
}

const env = result.data;
export { env };
