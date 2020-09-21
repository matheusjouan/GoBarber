// Técnica para receber qualquer nome de variavel, de valor string ou numero
interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  // arquivo da template
  file: string;
  // São variáveis que podem receber qualquer coisa
  variables: ITemplateVariables;
}
