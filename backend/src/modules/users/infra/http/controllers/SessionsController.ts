import { Request, Response } from 'express';
import { container } from 'tsyringe';

// Pega uma ou mais entidade e aplica os métodos (expose, exclude, etc)
import { classToClass } from 'class-transformer';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = container.resolve(CreateSessionService);

    const { user, token } = await createSession.execute({ email, password });

    // Aplica os métodos p/ retornar p/ o front-end
    return res.json({ user: classToClass(user), token });
  }
}
