import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jb_tweet_history')
export class TweetWriteHistoryEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'target_tweet_id',
    type: 'varchar',
    length: 50,
  })
  tweetId: string;

  @Column({
    name: 'command_payload',
    type: 'longtext',
  })
  payload: string;

  @Column({
    name: 'is_command',
    type: 'boolean',
  })
  isCommand: boolean;

  @Column({
    name: 'output_text',
    type: 'longtext',
  })
  outputText: string;

  @Column({
    name: 'output_medias',
    type: 'simple-array',
    nullable: true,
  })
  outputMedias: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
