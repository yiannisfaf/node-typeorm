import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from './Base';
import { User } from './User';

@Entity('posts')
export class Post extends Base {
  @Column({
    unique: true,
  })
  title: string;

  @Column()
  content: string;

  @Column({
    default: 'default-post.png',
  })
  image: string;

  //ManyToOne with User. In TypeOrm need to add Join for ManyToOne relationships
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;
}
