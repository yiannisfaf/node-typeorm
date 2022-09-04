import { Entity, Column, Index, BeforeInsert, OneToMany } from 'typeorm';
import Base from './Base';
import { Post } from './Post';
import crypto from 'crypto';
const bcrypt = require('bcryptjs');

// user can either be an Admin or a User
export enum RoleEnumType {
  USER = 'user',
  ADMIN = 'admin',
}

//users = name of the table
@Entity('users')
export class User extends Base {
  @Column()
  name: string;

  //index on email column - as it will be queried alot
  @Index('email_index')
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  //Hash password before saving to database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Validate password
  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  @Column({
    type: 'enum',
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;

  @Column({
    default: 'default.png',
  })
  photo: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Index('verificationCode_index')
  @Column({
    type: 'text',
    nullable: true,
  })
  verificationCode!: string | null;

  //A User can have many posts but a Post can belong to One User
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  //--------------------------------------------------------------
  //--------------------------------------------------------------
  //--------------------------------------------------------------
  //--------------------------------------------------------------
  //--------------------------------------------------------------

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString('hex');

    const hashedVerificationCode = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');

    return { verificationCode, hashedVerificationCode };
  }

  // override JSON response from typeOrm and set password and verified to undefined as they are protected fields
  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined,
      verificationCode: undefined,
    };
  }
}
