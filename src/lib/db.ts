// import 'server-only';
import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

const db = new PrismaClient();

export default db;
