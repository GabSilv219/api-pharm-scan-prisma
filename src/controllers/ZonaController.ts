import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export const getZone = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const zona = await prismaClient.zona.findUnique({where: {id: Number(id)}, include: {postos: true}})

    if(!zona){
      return res.status(401).json({error: "Região não encontrada!!"});
    }

    return res.status(200).json(zona);
  } catch (error) {
    return res.status(400).json({ error })
  }
};

export const getAllZones = async (req: Request, res: Response) => {
  try {
    const zona = await prismaClient.zona.findMany({include: {postos: true}});
    return res.status(200).json(zona);
  } catch (error) {
    console.log(error);
    return res.status(400).json({error: "Nenhuma zona encontrada!"})
  }
};

export const registerZone = async (req: Request, res: Response) => {
  try {
    const { nome, status } = req.body;

    let zona = await prismaClient.zona.findUnique({where: {nome}});

    if(zona){
      return res.status(401).json({error: "Já existe uma zona com este nome!"});
    }

    //validations
    if(!nome){
      return res.status(422).json({error: "Informar o nome é obrigatório!"})
    }

    zona = await prismaClient.zona.create({
      data: {
        nome,
        status,
      }
    });

    return res.status(200).json({zona, message: "Zona registrada com sucesso!"});
  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar registrar zona!"})
  }
};

export const updateZone = async (req: Request, res: Response) => {
  try {
    const { nome, status } = req.body;
    const { id } = req.params;

    let zona = await prismaClient.zona.findUnique({where: { id: Number(id) }});

    if(!zona){
      return res.status(401).json({error: "Zona não encontrada!"});
    }

    zona = await prismaClient.zona.update({
      where: {id: Number(id)},
      data: {
        nome,
        status
      },
    });

    return res.status(200).json({zona, message: "Registro de zona atualizado com sucesso!"});
  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar atualizar registro de zona!"})
  }
};

export const deleteZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let zona = await prismaClient.zona.findUnique({where: { id: Number(id) }});

    if(!zona){
      return res.status(401).json({error: "Zona não encontrada!"});
    }

    zona = await prismaClient.zona.delete({where: {id: Number(id)}});
    return res.status(200).json({zona, message: "Registro de zona deletado com sucesso!"});

  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar deletar registro de zona!"})
  }
};