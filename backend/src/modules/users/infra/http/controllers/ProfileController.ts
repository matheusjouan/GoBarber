import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserSerivce from '@modules/users/services/UpdateUserService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const showProfile = container.resolve(ShowProfileService);

    const userId = req.user.id;

    const user = await showProfile.execute({ user_id: userId });

    return res.status(200).json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, password, old_password } = req.body;

    const updateProfile = container.resolve(UpdateUserSerivce);

    const user = await updateProfile.execute({
      email,
      user_id: req.user.id,
      name,
      oldPassword: old_password,
      password,
    });

    return res.status(200).json(classToClass(user));
  }
}
