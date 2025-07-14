import { and, eq, sql } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';
import { generateAnswer, generateEmbeddings } from '../services/gemini.ts';

export const createRoomQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.uuid(),
        }),
        body: z.object({
          question: z.string(),
          answer: z.string().optional(),
        }),
      },
    },
    async (
      request: FastifyRequest<{
        Params: { roomId: string };
        Body: { question: string; answer?: string };
      }>,
      reply: FastifyReply
    ) => {
      const embeddings = await generateEmbeddings(request.body.question);
      const embeddingsAsString = `[${embeddings.join(',')}]`;
      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, request.params.roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
        )
        .limit(3);

      let answer: string | null = null;
      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription);
        answer = await generateAnswer(request.body.question, transcriptions);
      }

      const result = await db
        .insert(schema.questions)
        .values({
          roomId: request.params.roomId,
          question: request.body.question,
          answer,
        })
        .returning({
          id: schema.questions.id,
        });

      const insertRoomQuestion = result[0];
      if (!insertRoomQuestion) {
        reply.status(500).send({ error: 'Failed to create question' });
        return;
      }

      reply.status(201).send({ questionId: insertRoomQuestion.id, answer });
    }
  );
};
