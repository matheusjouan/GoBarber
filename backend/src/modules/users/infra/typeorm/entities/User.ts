import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

// Excluir um campo da classe, p/ qnd ir no front-end
// Expõe um novo campo que não existe na classe (virtual)
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  // Exclui esta informação p/ o front
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  // Cria esse campo (virtual)  o front
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk': {
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      }
      // case 's3': {
      //   return `https://${BUCKET}.siteamazonfornecido`;
      // }
      default:
        return null;
    }
  }
}

export default User;
