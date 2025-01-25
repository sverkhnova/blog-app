import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({ nullable: true })
  mediaUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn() 
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.blogPosts, { eager: true })
  author!: User;
}
