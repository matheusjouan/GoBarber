import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hooks', () => {
  // Método signIn()
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'Teste',
        email: 'teste@teste.com',
        password: '11111111',
      },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    // Espionar se a função setItem do localStorage foi disparada
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // result => retorna o que o hook/contexto nos traz
    // waitForNextUpdate => aguarda até a variável result seja alterada (async)
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      // Componente que poem por volta do contexto/hook, no caso o Provider
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'teste@teste.com',
      password: '111111',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
    expect(result.current.user.email).toEqual('teste@teste.com');
  });

  // Recuperaçao dos dados do localstorage
  it('should restore sabe date from stroage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';

        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Teste',
            email: 'teste@teste.com',
          });

        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('teste@teste.com');
  });

  // Método signOut()
  it('should be able to signOut', () => {
    // Para possuir um usuário já logado
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';

        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Teste',
            email: 'teste@teste.com',
          });

        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'clear');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Função que altera estado porém é sincrona, nao utiliza wait,e sim act
    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalled();
    expect(result.current.user).toBeUndefined();
  });

  // Método atualização usuário
  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user123',
      name: 'Teste',
      email: 'teste@teste.com',
      avatar_url: 'aaa.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
