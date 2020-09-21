/* eslint-disable prefer-object-spread */
import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';

import * as Yup from 'yup';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('E-mail válido')
            .required('E-mail obrigatório'),
          old_password: Yup.string(),
          // Condicional
          password: Yup.string().when('old_password', {
            // verifica se tem algum texto no campo
            is: text => !!text.length,
            // then: faça
            then: Yup.string().min(6, 'Senha mínimo 6 caracteres'),
            // senão, faça outra coisa
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              // verifica se tem algum texto no campo
              is: text => !!text.length,
              // then: faça
              then: Yup.string().min(6, 'Senha mínimo 6 caracteres'),
              // senão, faça outra coisa
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'As senhas não conferem'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // Uniao de dois objetos (junção)
        const formData = Object.assign(
          {
            // Campos obrigatório
            name: data.name,
            email: data.email,
          },
          data.old_password
            ? {
                old_password: data.password,
                password: data.password,
                password_confimation: data.password_confirmation,
              }
            : {},
        );

        // Chamada API passando os dados
        const repsonse = await api.put('profile', formData);

        // Atualiza o contexto, p/ mudança em tempo real
        updateUser(repsonse.data);

        addToast({
          type: 'success',
          title: 'Dados alterado com sucesso',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Senha atual não confere, favor tente novamente',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files) {
          // Formato a ser enviado multipart/formdata => p/ upload de arquivos
          const data = new FormData();
          // file => no do campo que deverá ter o mesmo nome dado na rota do back
          data.append('file', e.target.files[0]);

          const response = await api.patch('/users/avatar', data);

          // Atualiza os dados do contexto
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado com sucesso',
          });
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Avatar atualizado com sucesso',
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          // Retorna os dados para os input[name]
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            {/* htmlFor igual ao id do input, para fazer a referência ao input */}
            {/* id tem que ser o mesmo nome dado no backend no campo que ira receber */}
            <label htmlFor="file">
              <FiCamera />
              <input type="file" id="file" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" placeholder="Nome" icon={FiUser} />

          <Input name="email" placeholder="E-mail" icon={FiMail} />

          <Input
            name="old_password"
            type="password"
            placeholder="Senha atual"
            icon={FiLock}
            className="oldPassword"
          />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="password"
            type="password"
            placeholder="Nova senha"
            icon={FiLock}
          />

          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar nova senha"
            icon={FiLock}
          />

          <Button type="submit">Alterar dados</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
