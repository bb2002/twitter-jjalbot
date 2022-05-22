import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jb_jjal')
export class JjalEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'media_title',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mediaTitle: string;

  @Column({
    name: 'media_key',
    type: 'varchar',
    length: 255,
  })
  mediaKey: string;

  @Column({
    name: 'media_type',
    type: 'varchar',
    length: 50,
  })
  mediaType: string;

  @Column({
    name: 'media_url',
    type: 'varchar',
    length: 255,
  })
  mediaUrl: string;

  @Column({
    name: 'mentions',
    type: 'simple-array',
    nullable: true,
  })
  mentions: string[];

  @Column({
    name: 'hashtags',
    type: 'simple-array',
    nullable: true,
  })
  hashtags: string[];

  @Column({
    name: 'tweet_id',
    type: 'varchar',
    length: 30,
  })
  tweetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
