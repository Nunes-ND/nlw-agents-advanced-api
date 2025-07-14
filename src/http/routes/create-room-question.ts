import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

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
      const result = await db
        .insert(schema.questions)
        .values({
          roomId: request.params.roomId,
          question: request.body.question,
        })
        .returning({
          id: schema.questions.id,
        });

      const insertRoomQuestion = result[0];
      if (!insertRoomQuestion) {
        reply.status(500).send({ error: 'Failed to create question' });
        return;
      }

      reply.status(201).send({ questionId: insertRoomQuestion.id });
    }
  );
};
