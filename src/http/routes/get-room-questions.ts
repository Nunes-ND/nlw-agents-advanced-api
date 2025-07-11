import { desc, eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

export const getRoomQuestionaRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/questions',
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
      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, request.params.roomId))
        .orderBy(desc(schema.questions.createdAt));

      const roomQuestions = result;
      if (!roomQuestions) {
        reply.status(404).send({ error: 'Questions not found' });
        return;
      }
      reply.send(roomQuestions);
    }
  );
};
