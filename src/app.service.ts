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

  async test() {
    // 데이터 베이스 정보 객체
    const queryRunner = this.dataSource.createQueryRunner();

    // 연결
    await queryRunner.connect();
    // 트랜잭션 시작 (1. Start)
    await queryRunner.startTransaction();

    try {
      // 트랜잭션 작업 (2. Execute)

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
}
