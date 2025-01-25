import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { BlogPost } from './BlogPost';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: false }) // Новое поле
  isAdmin!: boolean;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  blogPosts!: BlogPost[];
}
