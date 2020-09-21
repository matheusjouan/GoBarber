import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';

import UsersController from '../controllers/UsersControllers';
import UserAvatarController from '../controllers/UserAvatarContoller';
import authMiddleware from '@modules/users/infra/http/middlewares/auth';

import uploadConfig from '@config/upload';

const usersRouter = Router();

const usersController = new UsersController();
const avatarUserController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  authMiddleware,
  upload.single('file'),
  avatarUserController.update,
);

export default usersRouter;
