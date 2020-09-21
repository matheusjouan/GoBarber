export default {
  jwt: {
    secret: process.env.APP_SECRET || '', // Para passar no teste
    expiresIn: '1d',
  },
};
