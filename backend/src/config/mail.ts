interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  // Serviço de e-mail utilizado da aplicação
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'emailconfigurado',
      name: 'GoBarber',
    },
  },
} as IMailConfig;
