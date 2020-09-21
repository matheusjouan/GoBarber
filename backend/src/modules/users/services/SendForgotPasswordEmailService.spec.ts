import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';

// Variáveis Globais
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgoPasswordEmail', () => {
  // Antes de cada teste instancia tudo abaixo
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '111111',
    });

    await sendForgotPasswordEmail.execute({
      email: 'teste@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  // Nao permitir que usuário não exista faça recuperação de senha
  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'teste@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Teste p/ geração de token assim que recuperar a senha
  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '111111',
    });

    await sendForgotPasswordEmail.execute({
      email: 'teste@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
