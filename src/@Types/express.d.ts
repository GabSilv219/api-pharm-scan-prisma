import { PrismaClient } from "../database/prismaClient";

declare global {
	namespace Express {
		export interface Request {
			posto: Partial<Posto>
		}
	}
}
