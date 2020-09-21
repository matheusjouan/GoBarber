import React from 'react';

import { render, fireEvent, waitFor } from '@testing-library/react';

// Lib p/ teste de estilização
import 'jest-styled-components';

import Input from '../../components/Input';

// Criando um mock para useField
jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldname: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  // O input utilizado no projeto depende do unform, pois utiliza useField(), necessitando um <Form />
  it('show be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    // toBeTruthy => se o elemento existe
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  // Teste quando dar focus no elemento, borda alaranjada
  it('should rendes highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    // Simula ação de focus no input
    fireEvent.focus(inputElement);

    // Espera que o elemento tenha um estilo, passa o estilo e valor
    await waitFor(() => {
      // toHaveStyleRule da lib jest-styled-components
      expect(containerElement).toHaveStyleRule('border-color', '#ff9000');
      expect(containerElement).toHaveStyleRule('color', '#ff9000');
    });

    // Simula ação do blur no input
    fireEvent.blur(inputElement);

    await waitFor(() => {
      // toHaveStyleRule da lib jest-styled-components
      expect(containerElement).not.toHaveStyleRule('border-color', '#ff9000');
      expect(containerElement).not.toHaveStyleRule('color', '#ff9000');
    });
  });

  // Teste quando dar focus no elemento, borda alaranjada
  it('should keep input border highlight when input Filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'example@example.com' },
    });

    // Simula ação do blur no input
    fireEvent.blur(inputElement);

    await waitFor(() => {
      // toHaveStyleRule da lib jest-styled-components
      expect(containerElement).toHaveStyleRule('color', '#ff9000');
    });
  });
});
