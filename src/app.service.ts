import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SamTest1Entity } from 'src/entities/sam-test1.entity';
import { SamTest2Entity } from 'src/entities/sam-test2.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SamTest1Entity)
    private readonly samTest1Repository: Repository<SamTest1Entity>,
    @InjectRepository(SamTest2Entity)
    private readonly samTest2Repository: Repository<SamTest2Entity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async samTest1() {
    // 데이터 베이스 정보 객체
    const queryRunner = this.dataSource.createQueryRunner();

    // 연결
    await queryRunner.connect();
    // 트랜잭션 시작 (1. Start)
    await queryRunner.startTransaction();

    try {
      // 트랜잭션 작업 (2. Execute)
      const samTest = new SamTest1Entity();
      samTest.text1 = '1111_changeValue';
      // 저장 1차
      await this.samTest1Repository.save(this.samTest1Repository.create(samTest));

      // await queryRunner.commitTransaction();

      const samTest2 = new SamTest2Entity();
      samTest2.text1 = '2222_sam_test';
      // 저장 2차
      await this.samTest2Repository.save(this.samTest2Repository.create(samTest2));

      // await queryRunner.commitTransaction();

      samTest.text1 = '1111_rollbackValue';
      // 저장 3차
      await this.samTest1Repository.save(this.samTest1Repository.create(samTest));

      // 업데이트
      await this.samTest2Repository.update(
        {
          id: 1,
        },
        { text1: '123213213' },
      );

      // 일부러 에러
      // throw '';

      // 트랜잭션 완료 (3. Commit)
      // 모든 내용 성공 (커밋)
      await queryRunner.commitTransaction();
    } catch (error) {
      // 트랜잭션 취소 (4. Rollback)
      // 모든 내용 실패 (롤백)
      await queryRunner.rollbackTransaction();
    } finally {
      // 연결해제
      await queryRunner.release();
    }
  }

  async samTest2() {
    try {
      await this.samTest1Repository.manager.transaction(async (one) => {
        await this.samTest2Repository.update(
          {
            id: 5,
          },
          {
            text2: '새로운거',
          },
        );
        const samTest = new SamTest1Entity();
        samTest.text1 = 'changeValue';
        await one.save(samTest);
        throw '에러남~';

        samTest.text1 = 'rollbackValue';
        await one.save(samTest);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async samTest3() {
    try {
      await this.dataSource.manager.transaction(async (one) => {
        await one.update(
          SamTest2Entity,
          {
            id: 5,
          },
          {
            text3: '333번 새로운거~~~!~',
          },
        );

        const samTest = new SamTest1Entity();
        samTest.text1 = '345435';
        await one.save(samTest);
        // throw '에러남~';

        samTest.text2 = 'rollbackValue';
        await one.save(samTest);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
