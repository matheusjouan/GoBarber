import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    // Leitura do arquivo
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    // Passa-se o arquivo de template
    const parseTemplate = handlebars.compile(templateFileContent);

    // retorna a função passando todas as variáveis como parâmetro
    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
