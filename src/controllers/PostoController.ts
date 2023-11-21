import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async(req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    // validations
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!senha) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    const posto = await prismaClient.posto.findUnique({ where: { email } });

    if (!posto) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(senha, posto.senha);

    if (passwordMatch) {
      const token = jwt.sign({ id: posto.id }, process.env.SECRET_KEY ?? '', {expiresIn: "1d"});
      res.status(200).json({msg: "Autenticação realizada com sucesso!", token, posto});
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const getUserPrivate = async(req: Request, res: Response) => {
  return res.json(req.posto);
};

export const getPosto = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const posto = await prismaClient.posto.findUnique({where: {id: Number(id)}, include: {medicamentos: true}});
    
    if(!posto){
      return res.status(401).json({error: "Posto não encontrado!"});
    }

    return res.status(200).json(posto);
  } catch (error) {
    return res.status(400).json({ error })
  }
};

export const getAllPostos = async (req: Request, res: Response) => {
  try {
    const posto = await prismaClient.posto.findMany({include: {medicamentos: true}});
    return res.status(200).json(posto);
  } catch (error) {
    return res.status(400).json({error: "Nenhum posto encontrado!"})
  }
};

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { nome, email, cep, bairro, rua, numero, cidade, estado, zona, senha, confirmarSenha } = req.body;

    
    // validations
    if (!nome) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
    
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if(!zona){
      return res.status(401).json({error: "A Zona é obrigatória!"});
    }

    if (!senha) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    if (senha != confirmarSenha) {
      return res
        .status(422)
        .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }

    const postoExiste = await prismaClient.posto.findUnique({where: {email}})

    if(postoExiste){
      return res.status(401).json({error: "Por favor, utilize outro email!"});
    }

    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt);

    const posto = await prismaClient.posto.create({data: {
      nome,
      email,
      cep,
      bairro,
      rua,
      numero,
      cidade,
      estado,
      zona,
      senha: senhaHash,
    }});

    return res.status(200).json({posto, message: "Posto registrado com sucesso!"});
  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar registrar posto!"})
  }
};
  
export const updatePosto = async (req: Request, res: Response) => {
  try {
    const { nome, email, cep, bairro, rua, numero, cidade, estado, zona, senha, confirmarSenha } = req.body;
    const { id } = req.params;

    let posto = await prismaClient.posto.findUnique({where: { id: Number(id) }});
    
    if(!posto){
      return res.status(401).json({error: "Posto não encontrado!"});
    }

    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt);

    posto = await prismaClient.posto.update({
      where: {id: Number(id)},
      data: {
        nome,
        email,
        cep,
        bairro,
        rua,
        numero,
        cidade,
        estado,
        zona,
        senha: senhaHash
      },
    });

    return res.status(200).json({posto, message: "Posto atualizado com sucesso!"});
  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar atualizar posto!"})
  }
};

export const deletePosto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let posto = await prismaClient.posto.findUnique({where: { id: Number(id) }});
    
    if(!posto){
      return res.status(401).json({error: "Posto não encontrado!"});
    }

    posto = await prismaClient.posto.delete({where: {id: Number(id)}});
    return res.status(200).json({posto, message: "Posto deletado com sucesso!"});

  } catch (error) {
    return res.status(400).json({error: "Falha ao tentar deletar posto!"})
  }
};