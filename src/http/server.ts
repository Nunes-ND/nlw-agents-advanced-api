import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { createRoomRoute } from './routes/create-room.ts';
import { createRoomQuestionRoute } from './routes/create-room-question.ts';
import { getRoomRoute } from './routes/get-room.ts';
import { getRoomQuestionaRoute } from './routes/get-room-questions.ts';
import { getRoomsRoute } from './routes/get-rooms.ts';
import { uploadQuestionAudioRoute } from './routes/upload-question-audio.ts';

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: env.FRONTEND_URL,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifyMultipart);

app.get('/health', () => {
  return { status: 'ok' };
});

app.register(createRoomRoute);
app.register(getRoomRoute);
app.register(getRoomsRoute);
app.register(getRoomQuestionaRoute);
app.register(createRoomQuestionRoute);
app.register(uploadQuestionAudioRoute);

app.listen({ port: env.PORT });
