

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
  
  ---
  
## 👨‍💻️ Como Usar  :

```shell
$ git clone https://github.com/matheusjouan/GoBarber.git
$ cd GoBarber

# Iniciando o Servidor Backend (localhost:3333)
$ cd backend
$ yarn install
$ yarn start

# Iniciando a Aplicação Web (localhost:3000)
$ cd web
$ yarn install
$ yarn start

# Iniciando a Aplicação Mobile (expo)
$ cd mobile
$ yarn  install
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
  
