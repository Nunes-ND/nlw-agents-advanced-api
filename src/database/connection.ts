import postgres from 'postgres';
import { env } from '../http/env.ts';
import { schema } from './schema/index.ts';

export const sql = postgres(env.DATABASE_URL);
