import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms',
    {
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
        }),
      },
    },
    async (
      request: FastifyRequest<{ Body: { name: string; description?: string } }>,
      reply: FastifyReply
    ) => {
      const result = await db
        .insert(schema.rooms)
        .values({
          name: request.body.name,
          description: request.body.description,
        })
        .returning({ id: schema.rooms.id });

      const insertRoom = result[0];
      if (!insertRoom) {
        reply.status(500).send({ error: 'Failed to create room' });
        return;
      }

      reply.status(201).send({ roomId: insertRoom.id });
    }
  );
};
