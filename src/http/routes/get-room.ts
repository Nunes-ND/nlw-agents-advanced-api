import { eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

export const getRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId',
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
          id: schema.rooms.id,
          name: schema.rooms.name,
        })
        .from(schema.rooms)
        .where(eq(schema.rooms.id, request.params.roomId))
        .limit(1);

      const [room] = result;
      if (!room) {
        reply.status(404).send({ error: 'Room not found' });
        return;
      }
      reply.send(room);
    }
  );
};
