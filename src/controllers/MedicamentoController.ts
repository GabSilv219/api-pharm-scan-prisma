import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';


export const getMedicamento = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const medicamento = await prismaClient.medicamento.findUnique({where: {id: Number(id)}, 
      include: {
        posto: {
          select: {
            nome: true,
            cep: true,
            bairro: true,
            rua: true,
            numero: true,
            cidade: true,
            estado: true
          }
        }
      }
    });
    
    if(!medicamento){
      return res.status(401).json({error: "Medicamento não encontrado!"});
    }

    return res.status(200).json(medicamento);
  } catch (error) {
    return res.status(400).json({ error })
  }
};

export const getAllMedicamentos = async (req: Request, res: Response) => {
  try {
    const medicamento = await prismaClient.medicamento.findMany({
      include: {
        posto: {
          select: {
            nome: true,
            cep: true,
            bairro: true,
            rua: true,
            numero: true,
            cidade: true,
            estado: true
          }
        }
      }
    });
    return res.status(200).json(medicamento);
  } catch (error) {
    console.log(error);
    return res.status(400).json({error: "Nenhum medicamento encontrado!"})
  }
};

export const registerMedicamento = async (req: Request, res: Response) => {
  try {
    const { nome, concentracao_composicao, forma_farmaceutica, quantidade, status } = req.body;
    const { postoId } = req.params;
    const posto = await prismaClient.posto.findUnique({where: {id: Number(postoId)}});

    if(!posto){
      return res.status(401).json({error: "Posto não encontrado!"});
    }

    const medicamento = await prismaClient.medicamento.create({
      data: {
        nome,
        concentracao_composicao,
        forma_farmaceutica,
        quantidade,
        status,
        postoId: Number(postoId)
      },
    });

    return res.status(200).json({medicamento, message: "Medicamento registrado com sucesso!"});
  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar registrar medicamento!"})
  }
};
  
export const updateMedicamento = async (req: Request, res: Response) => {
  try {
    const { nome, concentracao_composicao, forma_farmaceutica, quantidade, status } = req.body;
    const { id, postoId } = req.params;

    let medicamento = await prismaClient.medicamento.findUnique({where: { id: Number(id) }});
    
    if(!medicamento){
      return res.status(401).json({error: "Medicamento não encontrado!"});
    }

    medicamento = await prismaClient.medicamento.update({
      where: {id: Number(id)},
      data: {
        nome,
        concentracao_composicao,
        forma_farmaceutica,
        quantidade,
        status,
        postoId: Number(postoId)
      },
    });

    return res.status(200).json({medicamento, message: "Atualização de medicamento realizada com sucesso!"});
  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar atualizar medicamento!"})
  }
};

export const deleteMedicamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let medicamento = await prismaClient.medicamento.findUnique({where: { id: Number(id) }});
    
    if(!medicamento){
      return res.status(401).json({error: "Medicamento não encontrado!"});
    }

    medicamento = await prismaClient.medicamento.delete({where: {id: Number(id)}});
    return res.status(200).json({medicamento, message: "Registro de medicamento deletado com sucesso!"});

  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar deletar registro de medicamento!"})
  }
};