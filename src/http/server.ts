import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: env.FRONTEND_URL,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", async () => {
	return { status: "ok" };
});

app.listen({ port: env.PORT }).then((address) => {
	console.log(`Server listening at ${address}`);
});
