import path from 'path';
import fs from 'fs';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';
import mime from 'mime';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }
  public async saveFile(file: string): Promise<string> {
    const originPath = path.resolve(uploadConfig.tmpFolder, file);

    // Pega extensão
    const ContentType = mime.getType(originPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originPath);

    // Bucket: pasta criada no amazon
    await this.client
      .putObject({
        Bucket: 'app-gobatber',
        Key: file, // nome do arquivo
        ACL: 'public-read', // permisões para o arquivo
        Body: fileContent, // Conteudo (o arquivo em si)
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'app-gobatber',
        Key: file, // nome do arquivo
      })
      .promise();
  }
}
