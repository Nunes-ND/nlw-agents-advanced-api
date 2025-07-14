import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';
import { generateEmbeddings, transcribeAudio } from '../services/gemini.ts';

export const uploadQuestionAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.uuid(),
        }),
      },
    },
    async (
      request: FastifyRequest<{ Params: { roomId: string } }>,
      reply: FastifyReply
    ) => {
      const audio = await request.file();
      if (!audio) {
        reply.status(400).send({ error: 'Audio file is required' });
        return;
      }

      const audioBuffer = await audio.toBuffer();
      const audioBase64 = audioBuffer.toString('base64');
      const transcription = await transcribeAudio(audioBase64, audio.mimetype);
      const embeddings = await generateEmbeddings(transcription);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId: request.params.roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];
      if (!chunk) {
        reply.status(500).send({ error: 'Failed to create audio chunk' });
        return;
      }

      reply.status(201).send({
        audioChunkId: chunk.id,
      });
    }
  );
};
