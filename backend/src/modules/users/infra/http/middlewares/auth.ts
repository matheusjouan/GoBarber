/**
 * Como não tem acesso/importação do express, a aplicação não irá identificar
 * o valor nem a tipagem do request(req), response(res) e next, sendo necessário
 * importar essas tipagem do express e coloca-la nas variáveis, para serem reconhecidas
 */
import { Request, Response, NextFunction } from 'express';
import authConfig from '@config/auth';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function auth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Não foi encontrado o token JWT', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    console.log(token);
    throw new AppError('Token JWT inválido', 401);
  }
}
