import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { prismaClient } from '../database/prismaClient';

type JwtPayload = {
	id: number;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({error : 'Acesso Negado!'});
	}

	const token = authorization.split(' ')[1];

	try {
		const {id} = jwt.verify(token, process.env.SECRET_KEY ?? '') as JwtPayload;
	
		const posto = await prismaClient.posto.findUnique({where: {id: Number(id)}})
	
		if (!posto) {
			return res.status(401).json({error : 'Posto não autorizado!'});
		}

		const userResponse = {
			id: posto.id,
			nome: posto.nome,
			email: posto.email
		}
		req.posto = userResponse
		next();
		
	} catch (error) {
		return res.status(401).json({error: "Posto não autorizado!"});
	}
};
