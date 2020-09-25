

<p align="center">
<img src="https://github.com/matheusjouan/GoBarber/blob/master/GoBarber.png" width="320px"/>
<p align="center"><i>GoBarber.</i></p>
</p>


## 📔 Sobre

Aplicação desenvolvida durante o Bootcamp da Rocketseat, no qual houve um desenvolvimento tanto no backend, web e mobile.

Consiste em uma aplicação para agendamento de horários em um prestador de serviço para uma barberaria.
Na plataforma web, o prestador de serviço pode se cadastrar e oferecer seus serviços. Ao logar no sistema, ele poderá consultar os horários dos agendamentos de seus cliente no dia atual ou para uma data futura desejada.
Na plataforma mobile, foi criada exclusivamente para o cliente consultar os prestadores de serviços disponveis, datas e horários para uma eventual agendamento.

---

## :rocket: Tecnologias Utilizadas

- :floppy_disk: Bancos de dados:
  - Postgres
  - MongoDB
  - Redis

- 🌎 Backend:
  - NodeJS;
  - Express;
  - JSON Web Token
  - TypeScript;
  - TypeORM;
  - Multer;
  - Celabrate;
  - Nodemailer
  - Handlebars;
  - Date-fns
  - Cors.
  
- 💻 Frontend (Web):
  - ReacJS;
  - React Router DOM;
  - TypeScript;
  - Date-fns;
  - Polished;
  - Unform;
  - React-Spring;
  - Yup;
  - Axios;
  
- 📱  Mobile:
  - React Native;
  - TypeScript;
  - Yup;
  - Unform;
  - React Navigation;
  - Axios;
  - Async Storage;
  
- 📔 Padronização de Código:
  - ESLint
  - Prettier
  - EditorConfig
  
  ---
  
## 👨‍💻️ Como Usar  :

    
### Clonando e Acessando Projeto
```shell
$ git clone https://github.com/matheusjouan/GoBarber.git
$ cd GoBarber
```

### Credênciais do B.D
 - No arquivo **./GoBarber/backend/src/.env**, colocar as credênciais dos B.D da máquina utilizada
    - linha 17, 18 e 19 = relacionado ao Banco de Dados Redis
    - linha 22, 23 e 24 = relacionado ao Banco de Dados Relacional Postgres
    - linha 27, 28 e 29 = relacionado ao Banco de Dados MongoDB

### Iniciando o Servidor Backend (localhost:3333)
```shell
$ cd backend
$ yarn install

## Criação das Tabelas - Postgres (criar a Database antes)
$ yarn typeorm migration:run

## Execução do backend
$ yarn dev:server
```

### Iniciando a Aplicação Web (localhost:3000)
```shell
$ cd web
$ yarn install
$ yarn start
```

### Iniciando a Aplicação Mobile
```shell
$ cd mobile
$ yarn  install

## Execução do Emulador
yarn android / yarn ios

## Execução do Projeto
$ yarn start
```

---

## :hammer: Features Implementadas

### Backend:

  - [x] Criação de classes;
  - [x] Cadastro de Usuários/Autenticação;
  - [x] Envio de E-mail de recuperação de senha;
  - [x] Atualização da senha, a partir do recebimento de e-mail;
  - [x] Upload de imagem de avatar;
  - [x] Sistema de notificação de agendamento (MongoDB). 
     - [x] Assim que um cliente agendar um agendamento o prestador de serviço receberá um e-mail notificando da ação.
     - [x] Assim que um cliente cancelar um agendamento o prestador de serviço receberá um e-mail notificando da ação.
  - [x] Dados de pesquisa salvo em Cache (Redis)
  - [x] Feature: Cadastro / Autenticação / Atualização de Perfil / Pesquisa de prestadores de serviços, datas e horários disponíveis / Reset de Senha 

### Frontend:
  - [x] Criação Tela de Login
  - [x] Criação Tela de Recuperação de Senha
  - [x] Criação Tela de Dashboard (visualização dos agendamentos do dia ou data desejada).
  - [x] Criação Tela de Atualização do Perfil do prestador de serviço;

### Mobile

  - [x] Criação Tela de Login
  - [x] Criação Tela de Recuperação de Senha
  - [x] Criação Tela de Dashboard
     - [x] Visualização dos prestadores de serviços
     - [x] Visualização das datas disponveis para agendamento
  - [x] Criação Tela de Atualização do Perfil do prestador de serviço;
  
  
  ## Observação:
   - Erro de importação da lib utilizada para teste unitário
   - Arquivo: web//node_modules/@types/testing-library__react/node_modules/pretty-format/build/index.d.ts
    - Trocar a importação **import type * as PrettyFormat from './types'** por **import * as PrettyFormat from './types'** 
