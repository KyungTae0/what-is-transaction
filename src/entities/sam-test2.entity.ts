//NPM
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('sam_test2', { comment: '테스트 테이블' })
export class SamTest2Entity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: 'id',
    name: 'id',
  })
  id?: number;

  /**
   * 등록 일자
   */
  @CreateDateColumn({ name: 'created_at', comment: '등록일자' })
  createdAt?: Date;

  /**
   *수정 일자
   */
  @UpdateDateColumn({ name: 'updated_at', comment: '수정일자' })
  updatedAt?: Date;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'text1',
  })
  text1: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'text2',
  })
  text2: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'text3',
  })
  text3: string;
}
