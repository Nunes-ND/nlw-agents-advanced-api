import fastifyCors from '@fastify/cors';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { getRoomRoute } from './routes/get-room.ts';
import { getRoomsRoute } from './routes/get-rooms.ts';

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: env.FRONTEND_URL,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return { status: 'ok' };
});

app.register(getRoomRoute);
app.register(getRoomsRoute);

app.listen({ port: env.PORT });
